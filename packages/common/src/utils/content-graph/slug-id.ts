import { customAlphabet } from 'nanoid'

const Slugify = require('slugifyjs')
export const slugify = (str: string, locale = 'en') => Slugify.fromLocale(locale).parse(str)
export const contentSlug = (str: string, id: string, locale?: string) => `${id}-${slugify(str, locale)}`

const alphabet = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
export const newNodeId = customAlphabet(alphabet, 12)

export const newINodeIdSlug = (name: string, locale?: string) => {
  const id = newNodeId()
  const slug = contentSlug(name, id, locale)
  return { id, slug }
}
