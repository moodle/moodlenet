export * from 'path-to-regexp'

import _slugify from 'slugify'

export function webSlug(str?: string, opts?: { locale?: string }) {
  const slug =
    _slugify.default(str ?? '', { locale: opts?.locale, lower: true, strict: true }) || 'no-name'
  return slug.substring(0, 75)
}

export function searchPagePath(
  opts: {
    q?: Record<string, string | undefined> | string
  } = {},
) {
  const qs =
    typeof opts.q === 'string'
      ? `?${opts.q}`
      : typeof opts.q === 'object'
      ? '?' +
        Object.entries(opts.q)
          .map(([key, val]) => `${key}=${val}`)
          .join('&')
      : ''
  return `/search${qs}`
}
export function adminPagePath() {
  return `/admin`
}
