import { SessionToken } from '../../authentication-manager/dist/init.mjs'
import assert from 'assert'
import * as store from './store.mjs'
import { ConfirmEmailPayload, SignupReq } from './types.mjs'
import { authMngPkg, cryptoPkg, emailSrvPkg, webUserPkg } from './use-pkg-apis.mjs'

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
  const res = await authMngPkg.api('getSessionToken')({ uid: user.id })

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
  const { encrypted: confirmEmailToken } = await cryptoPkg.api('std/encrypt')({
    payload: JSON.stringify(confirmEmailPayload),
  })
  emailSrvPkg.api('send')({
    emailObj: {
      to: req.email,
      text: `hey ${req.displayName} confirm your email with /.pkg/@moodlenet/simple-email-auth/confirm-email/${confirmEmailToken}`,
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

  const user = await store.create({ email, password })

  const authRes = await authMngPkg.api('registerUser')({ uid: user.id })

  if (!authRes.success) {
    await store.delUser(user.id)
    const { msg, success } = authRes
    return { msg, success }
  }

  await webUserPkg.api('createProfile')({
    displayName,
    userId: authRes.user.id,
  })

  const { sessionToken } = authRes
  return { success: true, sessionToken }

  async function getConfirmEmailPayload() {
    const decryptRes = await cryptoPkg.api('std/decrypt')({ encrypted: token })

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
