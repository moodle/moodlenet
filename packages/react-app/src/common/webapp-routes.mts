export const PROFILE_HOME_PAGE_ROUTE_PATH = 'profile/:key'

export function getProfileHomePageRoutePath({ _key }: { _key: string }) {
  const path = PROFILE_HOME_PAGE_ROUTE_PATH.replace(':key', _key)
  return `/${path}`
}
