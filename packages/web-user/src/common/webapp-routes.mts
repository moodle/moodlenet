import { compile, match, webSlug } from '@moodlenet/react-app/common'

export const PROFILE_HOME_PAGE_ROUTE_PATH = '/profile/:key/:slug'
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
