import { instanceDomain } from '@moodlenet/core'
import * as crypto from '@moodlenet/crypto/server'
import { JwtToken } from '@moodlenet/crypto/server'
import { send } from '@moodlenet/email-service/server'
import { createWebUser, setCurrentWebUser } from '@moodlenet/react-app/server'
import { shell } from './shell.mjs'
import * as store from './store.mjs'
import { EmailPwdUser } from './store/types.mjs'
import { ConfirmEmailPayload, SignupReq } from './types.mjs'

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{ success: true } | { success: false }> {
  const user = await store.getByEmail(email)
  if (!user) {
    return { success: false }
  }

  const passwordMatches = await crypto.argon.verifyPwd({
    plainPwd: password,
    pwdHash: user.password,
  })

  if (!passwordMatches) {
    return { success: false }
  }

  const success = await shell.call(setCurrentWebUser)({ userKey: user.webUserKey })

  return { success }
}

export async function signup(
  req: SignupReq,
): Promise<{ success: true } | { success: false; msg: string }> {
  const mUser = await store.getByEmail(req.email)

  if (mUser) {
    return { success: false, msg: 'email exists' }
  }
  // console.log({ req })
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
  return { success: true }
}

export async function confirm({
  confirmToken,
}: {
  confirmToken: JwtToken
}): Promise<{ success: true; emailPwdUser: EmailPwdUser } | { success: false; msg: string }> {
  const confirmEmailPayload = await getConfirmEmailPayload()
  if (!confirmEmailPayload) {
    return { success: false, msg: `invalid confirm token` }
  }
  const {
    req: { displayName, email, password },
  } = confirmEmailPayload

  const mUser = await store.getByEmail(email)

  if (mUser) {
    return { success: false, msg: 'user registered' }
  }

  const newWebUser = await shell.call(createWebUser)(
    {
      displayName: displayName,
      isAdmin: false,
      contacts: { email },
      aboutMe: '',
    },
    { setAsCurrentUser: true },
  )

  if (!newWebUser) {
    return { success: false, msg: 'could not create' }
  }

  const emailPwdUser = await store.create({ email, password, webUserKey: newWebUser._key })

  return { success: true, emailPwdUser }

  async function getConfirmEmailPayload() {
    const jwtVerifyResp = await shell.call(crypto.jwt.verify)<ConfirmEmailPayload>(confirmToken)
    if (!jwtVerifyResp) {
      return
    }

    const { payload: confirmEmailPayload } = jwtVerifyResp

    return confirmEmailPayload
  }
}
