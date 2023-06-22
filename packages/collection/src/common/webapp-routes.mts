import { compile, match, webSlug } from '@moodlenet/react-app/common'

export const COLLECTION_HOME_PAGE_ROUTE_PATH = '/collection/:key/:slug'
type KeySlugParams = { key: string; slug: string }
export const collectionHomePageRoutePath = compile<KeySlugParams>(COLLECTION_HOME_PAGE_ROUTE_PATH)

export function getCollectionHomePageRoutePath({ _key, title }: { _key: string; title: string }) {
  const slug = webSlug(title)
  return collectionHomePageRoutePath({ key: _key, slug })
}

const _matchCollectionHomePageRoutePath = match<KeySlugParams>(COLLECTION_HOME_PAGE_ROUTE_PATH)
export function matchCollectionHomePageRoutePath(path: string) {
  return _matchCollectionHomePageRoutePath(path) || null
}
