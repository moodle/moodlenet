import { instanceDomain } from '@moodlenet/core'
import { CookieOptions, Response } from 'express'
import { SESSION_TOKEN_COOKIE_NAME } from '../common/pub-lib.mjs'
import { env } from './init.mjs'
import { shell } from './shell.mjs'
import type { MountAppItem } from './types.mjs'
export * from './types.mjs'

export const mountedApps: MountAppItem[] = []

export async function mountApp(mountItem: Pick<MountAppItem, 'getApp' | 'mountOnAbsPath'>) {
  const { pkgId: callerPkgId } = shell.assertCallInitiator()
  console.log(`HTTP: register mountApp for ${callerPkgId.name}`)
  mountedApps.push({ ...mountItem, pkgId: callerPkgId })
}

export async function getHttpBaseUrl() {
  const isStandardPort =
    (env.port === 80 && env.protocol === 'http') || (env.port === 443 && env.protocol === 'https')
  const maybeWithPort = isStandardPort ? '' : `:${env.port}`
  return `${env.protocol}://${instanceDomain}${maybeWithPort}`
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
