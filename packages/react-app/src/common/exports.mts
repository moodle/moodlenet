// import { WebUserSessionTokenCookieName } from './types.mjs'
// @index(['./**/*.mts'], f => `export * from '${f.path}.mjs'`)
export * from './appearance/colorUtilities.mjs'
export * from './appearance/data.mjs'
export * from './my-webapp/types.mjs'
export * from './types.mjs'
export * from './webapp-routes.mjs'

// @endindex

export const WEB_USER_SESSION_TOKEN_COOKIE_NAME = 'web-user-session-token'
export const WEB_USER_SESSION_TOKEN_AUTHENTICATED_BY_COOKIE_NAME =
  'web-user-session-authenticated-by'
// export const WEB_USER_SESSION_TOKEN_COOKIE_NAME: WebUserSessionTokenCookieName =
//   'web-user-session-token'
