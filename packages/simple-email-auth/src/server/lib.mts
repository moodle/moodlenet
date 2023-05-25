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
import { shell } from './shell.mjs'
import * as store from './store.mjs'
import type { ConfirmEmailPayload, SignupReq } from './types.mjs'

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

  const createNewWebUserResp = await shell.call(createWebUser)({
    displayName: displayName,
    isAdmin: false,
    contacts: { email },
  })

  if (!createNewWebUserResp) {
    return { success: false, msg: 'could not create new WebUser' } as const
  }
  const { jwtToken, newWebUser, newProfile } = createNewWebUserResp
  shell.call(sendWebUserTokenCookie)(jwtToken)

  const emailPwdUser = await store.create({ email, password, webUserKey: newWebUser._key })

  return { success: true, emailPwdUser, newWebUser, newProfile } as const

  async function getConfirmEmailPayload() {
    const jwtVerifyResp = await shell.call(crypto.jwt.verify)<ConfirmEmailPayload>(confirmToken)
    if (!jwtVerifyResp) {
      return
    }

    const { payload: confirmEmailPayload } = jwtVerifyResp

    return confirmEmailPayload
  }
}
