export const COLLECTION_HOME_PAGE_ROUTE_PATH = 'collection/:key'

export function getCollectionHomePageRoutePath({ _key }: { _key: string }) {
  return COLLECTION_HOME_PAGE_ROUTE_PATH.replace(':key', _key)
}
