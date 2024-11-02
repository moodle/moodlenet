import { map } from '@moodle/lib-types'
import QueryString from 'qs'

export function createRoutes<path_type extends string = appRoute>(baseUrl = '') {
  return function get<r extends appRoute>(route: r, opts?: r extends keyof routeOpts ? routeOpts[r] : never) {
    const qstring = opts?.q ? `?${QueryString.stringify(opts.q)}` : ''
    return `${baseUrl}${route}${qstring}` as path_type
  }
}
export const appRoutes = createRoutes()

// routes('/login', { q: { redirect: '/profile/a/a/da/ads/' } })
// routes(`/profile/${'das'}/${'dsa'}`)

type routeOpt<q extends never | map<string> = never> = {
  q?: q
}

type routeOpts = ReturnType<typeof routeOptsFn>
declare function routeOptsFn(): {
  '/login': routeOpt<{ redirect: appRoute }>
}

export type appRoute = __next_route_internal_types__.DynamicRoutes | __next_route_internal_types__.StaticRoutes
