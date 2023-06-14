import { compile, match, webSlug } from '@moodlenet/react-app/common'

export const PROFILE_HOME_PAGE_ROUTE_PATH = '/profile/:key/:slug'
export const FOLLOWING_PAGE_ROUTE_PATH = '/following'
export const BOOKMARKS_PAGE_ROUTE_PATH = '/bookmarks'
export const SETTINGS_PAGE_ROUTE_PATH = '/settings'
export const LOGIN_PAGE_ROUTE_BASE_PATH = '/login'
export const SIGNUP_PAGE_ROUTE_BASE_PATH = '/signup'
export const LOGIN_ROOT_PAGE_ROUTE_SUB_PATH = 'root'
type P = { key: string; slug: string }
export const profileHomePageRoutePath = compile<P>(PROFILE_HOME_PAGE_ROUTE_PATH)

export function getProfileHomePageRoutePath({ _key, title }: { _key: string; title: string }) {
  const slug = webSlug(title)
  return profileHomePageRoutePath({ key: _key, slug })
}

const _matchProfileHomePageRoutePath = match<P>(PROFILE_HOME_PAGE_ROUTE_PATH)
export function matchProfileHomePageRoutePath(path: string) {
  return _matchProfileHomePageRoutePath(path) || null
}
