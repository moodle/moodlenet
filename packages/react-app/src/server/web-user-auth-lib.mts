import { jwt, JwtToken } from '@moodlenet/crypto/server'
import { getCurrentHttpCtx } from '@moodlenet/http-server/server'
import { matchRootPassword } from '@moodlenet/system-entities/server'
import assert from 'assert'
import { CookieOptions } from 'express'
import { WEB_USER_SESSION_TOKEN_COOKIE_NAME } from '../common/exports.mjs'
import { shell } from './shell.mjs'
import { TokenCtx, UnverifiedTokenCtx, VerifiedTokenCtx, WebUserJwtPayload } from './types.mjs'

export async function signWebUserJwt(webUserJwtPayload: WebUserJwtPayload): Promise<JwtToken> {
  const sessionToken = await shell.call(jwt.sign)(webUserJwtPayload, {
    expirationTime: '2w',
    subject: !webUserJwtPayload.isRoot ? webUserJwtPayload.profileKey : undefined,
    scope: [/* 'full-user',  */ 'openid'],
  })
  return sessionToken
}

export async function verifyCurrentTokenCtx() {
  const currentCtx = shell.myAsyncCtx.get()
  if (!currentCtx?.tokenCtx) {
    return
  }
  if (currentCtx.tokenCtx.type === 'verified-token') {
    return currentCtx.tokenCtx
  }
  const { currentJwtToken } = currentCtx.tokenCtx
  const jwtVerifyResult = await shell.call(jwt.verify)<WebUserJwtPayload>(currentJwtToken)
  if (!jwtVerifyResult) {
    shell.myAsyncCtx.unset()
    return
  }
  const { payload: currentWebUser } = jwtVerifyResult
  const verifiedTokenCtx: VerifiedTokenCtx = {
    type: 'verified-token',
    currentJwtToken,
    currentWebUser,
  }

  return verifiedTokenCtx
}

export async function loginAsRoot(rootPassword: string): Promise<boolean> {
  const rootPasswordMatch = await matchRootPassword(rootPassword)
  if (!rootPasswordMatch) {
    return false
  }
  const jwtToken = await signWebUserJwt({ isRoot: true })
  sendWebUserTokenCookie(jwtToken)
  return true
}

async function setCurrentTokenCtx(tokenCtx: TokenCtx, sendCookie: boolean) {
  shell.myAsyncCtx.set(current => ({ ...current, tokenCtx }))

  sendCookie &&
    // tokenCtx?.type === 'verified-token' &&
    sendWebUserTokenCookie(tokenCtx?.currentJwtToken)
}

export async function setCurrentUnverifiedJwtToken(currentJwtToken: JwtToken) {
  const unverifiedTokenCtx: UnverifiedTokenCtx = {
    type: 'unverified-token',
    currentJwtToken,
  }
  await setCurrentTokenCtx(unverifiedTokenCtx, false)
}

export async function setCurrentVerifiedJwtToken(currentJwtToken: JwtToken, sendCookie: boolean) {
  const currentWebUser = await verifyWebUserToken(currentJwtToken)
  assert(currentWebUser)
  const verifiedTokenCtx: VerifiedTokenCtx = {
    type: 'verified-token',
    currentJwtToken,
    currentWebUser,
  }
  await setCurrentTokenCtx(verifiedTokenCtx, sendCookie)
}

export async function verifyWebUserToken(token: JwtToken) {
  const jwtVerifyResult = await shell.call(jwt.verify)<WebUserJwtPayload>(token)
  return jwtVerifyResult?.payload
}

////

function sendWebUserTokenCookie(jwtToken?: JwtToken) {
  const httpCtx = getCurrentHttpCtx()
  const httpResponse = httpCtx?.response

  if (!httpResponse) {
    return
  }

  if (!jwtToken) {
    const clearCookieOptions: CookieOptions = {
      /** FIXME: set proper options !!! */
    }
    httpResponse.clearCookie(WEB_USER_SESSION_TOKEN_COOKIE_NAME, clearCookieOptions)
    return
  }
  const setCookieOptions: CookieOptions = {
    /** FIXME: set proper options !!! */
  }
  httpResponse.cookie(WEB_USER_SESSION_TOKEN_COOKIE_NAME, jwtToken, setCookieOptions)
  return
}
