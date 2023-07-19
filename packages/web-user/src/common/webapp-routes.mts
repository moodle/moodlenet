import { compile, match, webSlug } from '@moodlenet/react-app/common'

export const PROFILE_HOME_PAGE_ROUTE_PATH = '/profile/:key/:slug'
export const FOLLOWING_PAGE_ROUTE_PATH = '/following'
export const BOOKMARKS_PAGE_ROUTE_PATH = '/bookmarks'
export const SETTINGS_PAGE_ROUTE_PATH = '/settings'
export const LOGIN_PAGE_ROUTE_BASE_PATH = '/login'
export const SIGNUP_PAGE_ROUTE_BASE_PATH = '/signup'
export const LOGIN_ROOT_PAGE_ROUTE_SUB_PATH = 'root'
type KeySlugParams = { key: string; slug: string }

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
