import { customAlphabet } from 'nanoid'
import { PermId, Slug } from '../../content-graph/types/node'

const Slugify = require('slugifyjs')
export const slugify = (str: string, locale = 'en'): Slug => Slugify.fromLocale(locale).parse(str)
export const contentSlug = (slug: Slug, permId: PermId, locale?: string) => `${permId}-${slugify(slug, locale)}`

const alphabet = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
export const newGlyphPermId = customAlphabet(alphabet, 12)

export const newGlyphIdentifiers = (name: string, locale?: string): { slug: string; permId: PermId } => {
  const permId = newGlyphPermId()
  const slug = contentSlug(name, permId, locale)
  return { permId, slug }
}
