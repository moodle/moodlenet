import { customAlphabet } from 'nanoid'
import { PermId, Slug } from '../../content-graph/types/node'

const Slugify = require('slugifyjs')
export const slugify = (str: string, locale = 'en'): Slug => Slugify.fromLocale(locale).parse(str)
export const contentSlug = (slug: Slug, permId: PermId, locale?: string) => `${permId}-${slugify(slug, locale)}`

const alphabet = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
export const newGlyphPermId = customAlphabet(alphabet, 12)

export const newGlyphIdentifiers = (name: string, locale?: string): { _slug: string; _permId: PermId } => {
  const _permId = newGlyphPermId()
  const _slug = contentSlug(name, _permId, locale)
  return { _permId, _slug }
}
