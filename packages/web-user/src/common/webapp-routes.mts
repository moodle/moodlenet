export const PROFILE_HOME_PAGE_ROUTE_PATH = 'profile/:key'
export const MY_PROFILE_HOME_PAGE_ROUTE_PATH = 'my-profile/'

export function getProfileHomePageRoutePath({ _key }: { _key: string }) {
  const path = PROFILE_HOME_PAGE_ROUTE_PATH.replace(':key', _key)
  return `/${path}`
}
