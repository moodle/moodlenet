// import {  compile,  match,  parse,  pathToRegexp,  regexpToFunction,  tokensToFunction,  tokensToRegexp,} from 'path-to-regexp'
// import type {  Key,  Match,  MatchFunction,  MatchResult,  ParseOptions,  Path,  PathFunction,  RegexpToFunctionOptions,  Token,  TokensToFunctionOptions,  TokensToRegexpOptions,} from 'path-to-regexp'
export * from 'path-to-regexp'

import _slugify from 'slugify'

export function webSlug(str?: string, opts?: { locale?: string }) {
  const slug = _slugify.default(str || 'no-name', { locale: opts?.locale, lower: true })
  return slug.substring(0, 75)
}
