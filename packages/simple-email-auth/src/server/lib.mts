import { instanceDomain } from '@moodlenet/core'
import type { JwtToken } from '@moodlenet/crypto/server'
import * as crypto from '@moodlenet/crypto/server'
import {
  createWebUser,
  sendWebUserTokenCookie,
  signWebUserJwtToken,
} from '@moodlenet/web-user/server'
import assert from 'assert'
import { send } from '../../../email-service/dist/server/exports.mjs'
import { SET_NEW_PASSWORD_PATH } from '../common/webapp-routes.mjs'
import { EmailPwdUserCollection } from './init/arangodb.mjs'
import { shell } from './shell.mjs'
import * as store from './store.mjs'
import type { ChangePasswordEmailPayload, ConfirmEmailPayload, SignupReq } from './types.mjs'

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

  const jwtToken = await shell.call(signWebUserJwtToken)({ webUserkey: user.webUserKey })
  assert(jwtToken, `Couldn't sign token for webUserKey:${user.webUserKey}`)
  shell.call(sendWebUserTokenCookie)(jwtToken)
  return { success: true } as const
}

export async function signup(req: SignupReq) {
  const mUser = await store.getByEmail(req.email)

  if (mUser) {
    return { success: false, msg: 'email exists' } as const
  }
  // shell.log('info', { req })
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

  shell.call(send)({
    emailObj: {
      to: req.email,
      text: `hey ${req.displayName} confirm your email on ${instanceDomain}/.pkg/@moodlenet/simple-email-auth/confirm-email/${confirmEmailToken}`,
    },
  })
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
    const jwtVerifyResp = await shell.call(crypto.jwt.verify)<ConfirmEmailPayload>(confirmToken)
    if (!jwtVerifyResp) {
      return
    }

    const { payload: confirmEmailPayload } = jwtVerifyResp

    return confirmEmailPayload
  }
}

export async function createSimpleEmailUser({
  displayName,
  email,
  hashedPassword,
  publisher = false,
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
    const jwtVerifyResp = await shell.call(crypto.jwt.verify)<ChangePasswordEmailPayload>(token)
    if (!jwtVerifyResp) {
      return
    }

    const { payload: confirmEmailPayload } = jwtVerifyResp

    return confirmEmailPayload
  }
}

export async function changePassword(
  { _key, newPassword }: { newPassword: string; _key: string },
  opts?: Partial<{ dontHash: boolean }>,
) {
  const password = opts?.dontHash ? newPassword : await crypto.argon.hashPwd(newPassword)
  await EmailPwdUserCollection.update({ _key }, { password })
}

export async function sendChangePasswordRequestEmail({ email }: { email: string }) {
  const user = await store.getByEmail(email)

  if (!user) {
    return false
  }
  // shell.log('info', { req })
  const changePasswordEmailPayload: ChangePasswordEmailPayload = { email }
  const changePasswordToken = await shell.call(crypto.jwt.sign)(changePasswordEmailPayload, {
    expirationTime: '1h',
  })

  shell.call(send)({
    emailObj: {
      to: email,
      text: `Follow the link to change your password ${instanceDomain}${SET_NEW_PASSWORD_PATH}?token=${changePasswordToken}`,
    },
  })
  return true
}
