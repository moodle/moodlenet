import type { JwtToken } from '@moodlenet/crypto/server'
import * as crypto from '@moodlenet/crypto/server'
import { send } from '@moodlenet/email-service/server'
import { getMyRpcBaseUrl } from '@moodlenet/http-server/server'
import { getOrgData } from '@moodlenet/organization/server'
import { getWebappUrl } from '@moodlenet/react-app/server'
import {
  createWebUser,
  sendWebUserTokenCookie,
  signWebUserJwtToken,
  verifyCurrentTokenCtx,
} from '@moodlenet/web-user/server'
import assert from 'assert'
import { newUserRequestEmail } from '../common/emails/NewUserRequestEmail/NewUserRequestEmail'
import { passwordChangedEmail } from '../common/emails/PasswordChangedEmail/PasswordChangedEmail'
import { recoverPasswordEmail } from '../common/emails/RecoverPasswordEmail/RecoverPasswordEmail'
import { SET_NEW_PASSWORD_PATH } from '../common/webapp-routes.mjs'
import { EmailPwdUserCollection } from './init/arangodb.mjs'
import { env } from './init/env.mjs'
import { shell } from './shell.mjs'
import * as store from './store.mjs'
import type { ChangePasswordEmailPayload, ConfirmEmailPayload, SignupReq } from './types.mjs'

const myBaseRpcHttpUrl = await shell.call(getMyRpcBaseUrl)()

export async function login({ email, password }: { email: string; password: string }) {
  const user = await store.getByEmail(email)
  if (!user) {
    return { success: false } as const
  }

  const passwordMatches = await crypto.argon.verifyPwd({
    plainPwd: password,
    pwdHash: user.password,
  })

  if (!passwordMatches) {
    return { success: false } as const
  }

  const jwtToken = await shell.call(signWebUserJwtToken)({
    webUserkey: user.webUserKey,
    sendTokenCookie: true,
  })
  assert(jwtToken, `Couldn't sign token for webUserKey:${user.webUserKey}`)
  return { success: true } as const
}

export async function signup(req: SignupReq) {
  const mUser = await store.getByEmail(req.email)

  if (mUser) {
    return { success: false, msg: 'Email already exists' } as const
  }
  // shell.log('debug', { req })
  const confirmEmailPayload: ConfirmEmailPayload = {
    req: {
      email: req.email,
      password: await crypto.argon.hashPwd(req.password),
      displayName: req.displayName,
    },
  }
  const confirmEmailToken = await shell.call(crypto.jwt.sign)(confirmEmailPayload, {
    expirationTime: '1w',
  })

  const orgData = await getOrgData()

  const emailContent = newUserRequestEmail({
    receiverEmail: req.email,
    instanceName: orgData.data.instanceName,
    actionUrl: `${myBaseRpcHttpUrl}confirm-email/${confirmEmailToken}`,
  })

  shell.call(send)(emailContent)
  return { success: true, confirmEmailToken } as const
}

export async function confirm({ confirmToken }: { confirmToken: JwtToken }) {
  const confirmEmailPayload = await getConfirmEmailPayload()
  if (!confirmEmailPayload) {
    return { success: false, msg: `invalid confirm token` } as const
  }
  const {
    req: { displayName, email, password },
  } = confirmEmailPayload

  const mUser = await store.getByEmail(email)

  if (mUser) {
    return { success: false, msg: 'email registered' } as const
  }

  const createResponse = await createSimpleEmailUser({
    displayName,
    email,
    hashedPassword: password,
  })

  createResponse.sendHttpJwtToken?.()

  return createResponse

  async function getConfirmEmailPayload() {
    const jwtVerifyResp = await shell.call(crypto.jwt.verify)<ConfirmEmailPayload>(
      confirmToken,
      isConfirmEmailPayload,
    )
    if (!jwtVerifyResp) {
      return
    }

    const { payload: confirmEmailPayload } = jwtVerifyResp

    return confirmEmailPayload
  }
}

function isConfirmEmailPayload(_: any): _ is ConfirmEmailPayload {
  return (
    typeof _?.req?.email === 'string' &&
    typeof _?.req?.password === 'string' &&
    typeof _?.req?.displayName === 'string'
  )
}
export async function createSimpleEmailUser({
  displayName,
  email,
  hashedPassword,
  publisher = !env.newUserNotPublisher,
  isAdmin = false,
}: {
  displayName: string
  email: string
  hashedPassword: string
  publisher?: boolean
  isAdmin?: boolean
}) {
  const createNewWebUserResp = await shell.call(createWebUser)({
    displayName,
    isAdmin,
    publisher,
    contacts: { email },
  })

  if (!createNewWebUserResp) {
    return { success: false, msg: 'could not create new WebUser' } as const
  }

  const { jwtToken, newWebUser, newProfile } = createNewWebUserResp

  const emailPwdUser = await store.create({
    email,
    password: hashedPassword,
    webUserKey: newWebUser._key,
  })

  return {
    success: true,
    emailPwdUser,
    newWebUser,
    newProfile,
    sendHttpJwtToken() {
      shell.call(sendWebUserTokenCookie)(jwtToken)
    },
  } as const
}

export async function changeMyPasswordUsingToken({
  newPassword,
  token,
}: {
  newPassword: string
  token: string
}) {
  const changePasswordEmailPayload = await getChangePasswordEmailPayload()
  if (!changePasswordEmailPayload) {
    return false
  }
  const user = await store.getByEmail(changePasswordEmailPayload.email)
  if (!user) {
    return false
  }

  await changePassword({ _key: user._key, newPassword })
  return true

  async function getChangePasswordEmailPayload() {
    const jwtVerifyResp = await shell.call(crypto.jwt.verify)<ChangePasswordEmailPayload>(
      token,
      isChangePasswordEmailPayload,
    )
    if (!jwtVerifyResp) {
      return
    }

    const { payload: confirmEmailPayload } = jwtVerifyResp

    return confirmEmailPayload
  }
}
function isChangePasswordEmailPayload(_: any): _ is ChangePasswordEmailPayload {
  return typeof _?.email === 'string'
}
export async function changePassword(
  { _key, newPassword }: { newPassword: string; _key: string },
  opts?: Partial<{ dontHash: boolean }>,
) {
  const password = opts?.dontHash ? newPassword : await crypto.argon.hashPwd(newPassword)

  const resp = await EmailPwdUserCollection.update({ _key }, { password }, { returnNew: true })
  if (!resp.new) {
    return false
  }
  const content = passwordChangedEmail({ receiverEmail: resp.new.email })
  shell.call(send)(content)
  return true
}

export async function sendChangePasswordRequestEmail({ email }: { email: string }) {
  const user = await store.getByEmail(email)

  if (!user) {
    return false
  }
  // shell.log('debug', { req })
  const changePasswordEmailPayload: ChangePasswordEmailPayload = { email }
  const changePasswordToken = await shell.call(crypto.jwt.sign)(changePasswordEmailPayload, {
    expirationTime: '1h',
  })

  const content = recoverPasswordEmail({
    actionUrl: `${getWebappUrl(SET_NEW_PASSWORD_PATH)}?token=${changePasswordToken}`,
    receiverEmail: email,
  })

  shell.call(send)(content)
  return true
}

export async function webUserDeleted({ webUserKey }: { webUserKey: string }) {
  const emailPwdUser = await store.getByWebUserKey(webUserKey)
  if (!emailPwdUser) {
    return
  }
  await EmailPwdUserCollection.remove({ _key: emailPwdUser._key })
  return emailPwdUser
}

export async function getCurrentEmailPwdUser() {
  const tokenCtx = await verifyCurrentTokenCtx()
  if (!tokenCtx || tokenCtx.payload.isRoot) {
    return
  }
  const currentEmailPwdUser = store.getByWebUserKey(tokenCtx.payload.webUser._key)
  return currentEmailPwdUser
}
