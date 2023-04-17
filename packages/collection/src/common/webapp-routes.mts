export const COLLECTION_HOME_PAGE_ROUTE_PATH = 'collection/:key'

export function matchCollectionHomePageRoutePathKey(path: string) {
  return path.match(
    new RegExp(`${COLLECTION_HOME_PAGE_ROUTE_PATH.replace(':key', '([0-z]+)')}`),
  )?.[1]
}

export function getCollectionHomePageRoutePath({ _key }: { _key: string }) {
  return COLLECTION_HOME_PAGE_ROUTE_PATH.replace(':key', _key)
}
