//  from :
// @types/react-router/index.d.ts
// react-router/cjs/react-router.js#306

import { compile, PathFunction } from 'path-to-regexp'
export type ExtractRouteParams<T extends string> = string extends T
  ? { [k in string]?: string | number | boolean }
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? ExtractRouteOptionalParam<Param> & ExtractRouteParams<Rest>
  : T extends `${infer _Start}:${infer Param}`
  ? ExtractRouteOptionalParam<Param>
  : {}
export type ExtractRouteOptionalParam<T extends string> = T extends `${infer Param}?`
  ? { [k in Param]?: string | number | boolean }
  : { [k in T]: string | number | boolean }

const cache: Record<string, PathFunction<object>> = {}
let cacheCount = 0
let cacheLimit = 200

function compilePath(path: string) {
  if (cache[path]) return cache[path]!
  var generator = compile(path)

  if (cacheCount < cacheLimit) {
    cache[path] = generator
    cacheCount++
  }

  return generator
}
/**
 * Public API for generating a URL pathname from a path and parameters.
 */

export function generatePath<Path extends string>(path: Path, params: ExtractRouteParams<Path>): string {
  return path === '/' ? path : compilePath(path)(params)
}
