import { compile, match, webSlug } from '@moodlenet/react-app/common'

export const RESOURCE_HOME_PAGE_ROUTE_PATH = '/resource/:key/:slug'
export const CREATE_RESOURCE_PAGE_ROUTE_PATH = '/create-resource'
type KeySlugParams = { key: string; slug: string }
export const resourceHomePageRoutePath = compile<KeySlugParams>(RESOURCE_HOME_PAGE_ROUTE_PATH)

export function getResourceHomePageRoutePath({ _key, title }: { _key: string; title: string }) {
  const slug = webSlug(title)
  return resourceHomePageRoutePath({ key: _key, slug })
}

const _matchResourceHomePageRoutePath = match<KeySlugParams>(RESOURCE_HOME_PAGE_ROUTE_PATH)
export function matchResourceHomePageRoutePath(path: string) {
  return _matchResourceHomePageRoutePath(path) || null
}
