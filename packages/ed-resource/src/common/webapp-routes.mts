export const RESOURCE_HOME_PAGE_ROUTE_PATH = 'resource/:key'

export function getResourceHomePageRoutePath({ _key }: { _key: string }) {
  return RESOURCE_HOME_PAGE_ROUTE_PATH.replace(':key', _key)
}
