import {
  getSessionToken,
  registerUser,
  SessionToken,
  setCurrentClientSessionToken,
} from '@moodlenet/authentication-manager/server'
import { instanceDomain } from '@moodlenet/core'
import * as crypto from '@moodlenet/crypto/server'
import { send } from '@moodlenet/email-service/server'
import { createWebUser } from '@moodlenet/react-app/server'
import assert from 'assert'
import { shell } from './shell.mjs'
import * as store from './store.mjs'
import { ConfirmEmailPayload, SignupReq } from './types.mjs'

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{ success: true } | { success: false }> {
  const user = await store.getByEmail(email)
  const userExistsAndPasswordMatches =
    !!user && (await crypto.argon.verifyPwd({ plainPwd: password, pwdHash: user.password }))

  if (!userExistsAndPasswordMatches) {
    return { success: false }
  }

  const maybeSessionToken = await shell.call(getSessionToken)({ uid: user._key })

  setCurrentClientSessionToken(maybeSessionToken)

  const success = !!maybeSessionToken
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
  token,
}: {
  token: string
}): Promise<{ success: true; sessionToken: SessionToken } | { success: false; msg: string }> {
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

  const myUser = await store.create({ email, password })

  const authRes = await shell.call(registerUser)({
    uid: myUser._key,
  })

  if (!authRes.success) {
    await store.delUser({ _key: myUser._key })
    const { msg, success } = authRes
    return { msg, success }
  }
  const { sessionToken } = authRes
  return shell.initiateCall(async () => {
    await setCurrentClientSessionToken(sessionToken)

    await createWebUser({
      userKey: authRes.user._key,
      displayName: displayName,
      isAdmin: false,
      contacts: { email },
      aboutMe: '',
    })

    return { success: true, sessionToken }
  })

  async function getConfirmEmailPayload() {
    try {
      const { payload: confirmEmailPayload } = await shell.call(crypto.jwt.verify)(token)

      assert(isConfirmEmailPayload(confirmEmailPayload))
      return confirmEmailPayload
    } catch {
      return undefined
    }
  }
}
function isConfirmEmailPayload(_: unknown): _ is ConfirmEmailPayload {
  //FIXME: implement checks
  return !!_
}
