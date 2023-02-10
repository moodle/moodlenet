import { getSessionToken, registerUser, SessionToken } from '@moodlenet/authentication-manager'
import * as crypto from '@moodlenet/crypto'
import { send } from '@moodlenet/email-service'
import { getHttpBaseUrl } from '@moodlenet/http-server'
import { createProfile } from '@moodlenet/react-app/server'
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
}): Promise<SessionToken | undefined> {
  const user = await store.getByEmail(email)
  const userExistsAndPasswordMatches =
    !!user && (await crypto.argon.verifyPwd({ plainPwd: password, pwdHash: user.password }))

  if (!userExistsAndPasswordMatches) {
    return
  }

  const maybeSessionToken = await shell.call(getSessionToken)({ uid: user.id })

  return maybeSessionToken
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
  const { encrypted: confirmEmailToken } = await shell.call(crypto.std.encrypt)({
    payload: JSON.stringify(confirmEmailPayload),
  })
  shell.call(send)({
    emailObj: {
      to: req.email,
      text: `hey ${
        req.displayName
      } confirm your email on ${await getHttpBaseUrl()}/.pkg/@moodlenet/simple-email-auth/confirm-email/${confirmEmailToken}`,
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
    uid: myUser.id,
  })

  if (!authRes.success) {
    await store.delUser(myUser.id)
    const { msg, success } = authRes
    return { msg, success }
  }

  await shell.call(createProfile)({
    title: displayName,
    userId: authRes.user.id,
    isAdmin: false,
    contacts: { email },
  })

  const { sessionToken } = authRes
  return { success: true, sessionToken }

  async function getConfirmEmailPayload() {
    const decryptRes = await shell.call(crypto.std.decrypt)({ encrypted: token })

    try {
      assert(decryptRes.valid)

      const confirmEmailPayload = JSON.parse(decryptRes.payload)
      assert(isConfirmEmailPayload(confirmEmailPayload), `invalid confirmation token`)
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
