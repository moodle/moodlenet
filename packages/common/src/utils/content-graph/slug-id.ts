import { customAlphabet } from 'nanoid'
import { PermId, Slug } from '../../content-graph/types/node'
import { EdgeType, NodeType } from '../../graphql/types.graphql.gen'

const Slugify = require('slugifyjs')
export const slugify = (str: string, locale = 'en'): Slug => Slugify.fromLocale(locale).parse(str)
export const contentSlug = (slug: Slug, permId: PermId, locale?: string) => `${permId}-${slugify(slug, locale)}`

const alphabet = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
export const newGlyphKey = customAlphabet(alphabet, 12)

export const newGlyphIdentifiers = (
  name: string,
  glyphType: NodeType | EdgeType,
  locale?: string,
): [id: string, slug: string, key: string] => {
  const key = newGlyphKey()
  const id = `${glyphType}/key`
  const slug = contentSlug(name, key, locale)
  return [id, slug, key]
}
