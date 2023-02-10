import { CookieOptions, Response } from 'express'
import { env } from './env.mjs'
import { SESSION_TOKEN_COOKIE_NAME } from './ext-ports-app/pub-lib.mjs'
import shell from './shell.mjs'
import type { MountAppItem } from './types.mjs'
export * from './types.mjs'

export const mountedApps: MountAppItem[] = []

export async function mountApp(mountItem: Pick<MountAppItem, 'getApp' | 'mountOnAbsPath'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  console.log(`HTTP: register mountApp for ${callerPkgId.name}`)
  mountedApps.push({ ...mountItem, pkgId: callerPkgId })
}

export async function getHttpBaseUrl() {
  return `${env.domain.protocol}://${env.domain.name}`
}

export function sendAuthTokenCookie(httpResp: Response, newToken: string | void) {
  const sessionCookieOtions: CookieOptions = {
    /** FIXME: set proper options !!! */
  }
  if (!newToken) {
    httpResp.clearCookie(SESSION_TOKEN_COOKIE_NAME, sessionCookieOtions)
    return
  }
  httpResp.cookie(SESSION_TOKEN_COOKIE_NAME, newToken, sessionCookieOtions)
}
