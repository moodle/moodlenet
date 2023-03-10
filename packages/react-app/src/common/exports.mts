import { WebUserSessionTokenCookieName } from './types.mjs'

// @index(['./**/*.mts'], f => `export * from '${f.path}.mjs'`)
export * from './appearance/colorUtilities.mjs'
export * from './appearance/data.mjs'
export * from './my-webapp/types.mjs'
export * from './types.mjs'
// @endindex

export const WEB_USER_SESSION_TOKEN_COOKIE_NAME: WebUserSessionTokenCookieName =
  'web-user-session-token'
