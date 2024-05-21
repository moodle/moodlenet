import { compile, match, webSlug } from '@moodlenet/react-app/common'
import { useLocation } from 'react-router-dom'
export const SESSION_CHANGE_REDIRECT_Q_NAME = '_sr'
export const PROFILE_HOME_PAGE_ROUTE_PATH = '/profile/:key/:slug'
export const BOOKMARKS_PAGE_ROUTE_PATH = '/bookmarks'
export const SETTINGS_PAGE_ROUTE_PATH = '/settings'
export const LOGIN_PAGE_ROUTE_BASE_PATH = '/login'
export const SIGNUP_PAGE_ROUTE_BASE_PATH = '/signup'
export const LOGIN_ROOT_PAGE_ROUTE_SUB_PATH = 'root'
export const USER_AGREEMENTS_PAGE_PATH = '/static/user-agreements'
export const DELETE_ACCOUNT_SUCCESS_PAGE_PATH = '/static/deleted-account-success'

type KeySlugParams = { key: string; slug: string }

export function useLoginPageRoutePathRedirectToCurrent() {
  const loc = useLocation()

  return loginPageRoutePath({ redirectTo: `${loc.pathname}${loc.search}${loc.hash}` })
}

export function loginPageRoutePath(opts?: { redirectTo?: string }) {
  const redirectTo = opts?.redirectTo || '/'
  const usp = new URLSearchParams()
  usp.append(SESSION_CHANGE_REDIRECT_Q_NAME, redirectTo)

  return `${LOGIN_PAGE_ROUTE_BASE_PATH}?${usp.toString()}`
}

export const profileHomePageRoutePath = compile<KeySlugParams>(PROFILE_HOME_PAGE_ROUTE_PATH)

export function getProfileHomePageRoutePath({
  _key,
  displayName,
}: {
  _key: string
  displayName: string
}) {
  const slug = webSlug(displayName)
  return profileHomePageRoutePath({ key: _key, slug })
}

const _matchProfileHomePageRoutePath = match<KeySlugParams>(PROFILE_HOME_PAGE_ROUTE_PATH)
export function matchProfileHomePageRoutePath(path: string) {
  return _matchProfileHomePageRoutePath(path) || null
}

// FOLLOWERS PAGE
export const PROFILE_FOLLOWERS_PAGE_ROUTE_PATH = `${PROFILE_HOME_PAGE_ROUTE_PATH}/followers`
export const profileFollowersRoutePath = compile<KeySlugParams>(PROFILE_FOLLOWERS_PAGE_ROUTE_PATH)
const _matchProfileFollowersHomePageRoutePath = match<KeySlugParams>(
  PROFILE_FOLLOWERS_PAGE_ROUTE_PATH,
)
export function matchProfileFollowersHomePageRoutePath(path: string) {
  return _matchProfileFollowersHomePageRoutePath(path) || null
}
export function getProfileFollowersRoutePath({
  key,
  displayName,
}: {
  key: string
  displayName: string
}) {
  const slug = webSlug(displayName)
  return profileFollowersRoutePath({ key, slug })
}

const _matchFollowersRoutePath = match<KeySlugParams>(PROFILE_FOLLOWERS_PAGE_ROUTE_PATH)
export function matchFollowersRoutePath(path: string) {
  return _matchFollowersRoutePath(path) || null
}

// FOLLOWING PAGE
export const PROFILE_FOLLOWING_PAGE_ROUTE_PATH = `${PROFILE_HOME_PAGE_ROUTE_PATH}/following`
export const profileFollowingRoutePath = compile<KeySlugParams>(PROFILE_FOLLOWING_PAGE_ROUTE_PATH)
const _matchProfileFollowingHomePageRoutePath = match<KeySlugParams>(
  PROFILE_FOLLOWING_PAGE_ROUTE_PATH,
)
export function matchProfileFollowingHomePageRoutePath(path: string) {
  return _matchProfileFollowingHomePageRoutePath(path) || null
}
export function getProfileFollowingRoutePath({
  key,
  displayName,
}: {
  key: string
  displayName: string
}) {
  const slug = webSlug(displayName)
  return profileFollowingRoutePath({ key, slug })
}

const _matchFollowingRoutePath = match<KeySlugParams>(PROFILE_FOLLOWING_PAGE_ROUTE_PATH)
export function matchFOLLOWINGRoutePath(path: string) {
  return _matchFollowingRoutePath(path) || null
}
