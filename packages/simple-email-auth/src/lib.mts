import { getSessionToken, registerUser, SessionToken } from '@moodlenet/authentication-manager'
import * as crypto from '@moodlenet/crypto'
import { send } from '@moodlenet/email-service'
import { createProfile } from '@moodlenet/web-user'
import assert from 'assert'
import shell from './shell.mjs'
import * as store from './store.mjs'
import { ConfirmEmailPayload, SignupReq } from './types.mjs'

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{ success: true; sessionToken: SessionToken } | { success: false }> {
  const user = await store.getByEmail(email)
  if (!user || user.password !== password) {
    return { success: false }
  }
  const res = await shell.call(getSessionToken)({ uid: user.id })

  if (!res.success) {
    return { success: false }
  }
  const sessionToken = res.sessionToken
  return { success: true, sessionToken }
}

export async function signup(
  req: SignupReq,
): Promise<{ success: true } | { success: false; msg: string }> {
  const mUser = await store.getByEmail(req.email)

  if (mUser) {
    return { success: false, msg: 'email exists' }
  }

  const confirmEmailPayload: ConfirmEmailPayload = {
    req,
  }
  const { encrypted: confirmEmailToken } = await shell.call(crypto.std.encrypt)({
    payload: JSON.stringify(confirmEmailPayload),
  })
  shell.call(send)({
    emailObj: {
      to: req.email,
      text: `hey ${req.title} confirm your email with /.pkg/@moodlenet/simple-email-auth/confirm-email/${confirmEmailToken}`,
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
    req: { title, email, password },
  } = confirmEmailPayload

  const mUser = await store.getByEmail(email)

  if (mUser) {
    return { success: false, msg: 'user registered' }
  }

  const myUser = await store.create({ email, password })

  const authRes = await shell.call(registerUser)({
    uid: myUser.id,
    isAdmin: false,
  })

  if (!authRes.success) {
    await store.delUser(myUser.id)
    const { msg, success } = authRes
    return { msg, success }
  }

  await shell.call(createProfile)({
    title,
    userId: authRes.user.id,
  })

  const { sessionToken } = authRes
  return { success: true, sessionToken }

  async function getConfirmEmailPayload() {
    const decryptRes = await shell.call(crypto.std.decrypt)({ encrypted: token })

    try {
      assert(decryptRes.valid)

      const confirmEmailPayload = JSON.parse(decryptRes.payload)
      assert(isConfirmEmailPayload(confirmEmailPayload))
      return confirmEmailPayload
    } catch {
      return undefined
    }
  }
}
function isConfirmEmailPayload(_: any): _ is ConfirmEmailPayload {
  //FIXME: implement checks
  return !!_
}
