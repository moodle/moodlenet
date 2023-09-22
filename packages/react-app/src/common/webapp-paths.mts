export * from 'path-to-regexp'

import _slugify from 'slugify'

export function webSlug(str?: string, opts?: { locale?: string }) {
  const slug = _slugify.default(str ?? '', { locale: opts?.locale, lower: true }) || 'no-name'
  return slug.substring(0, 75)
}
