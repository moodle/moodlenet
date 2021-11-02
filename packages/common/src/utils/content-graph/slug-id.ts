import { customAlphabet } from 'nanoid'
import { PermId, Slug } from '../../content-graph/types/node'

const Slugify = require('slugifyjs')
export const slugify = ({ str, locale = 'en' }: { str: string; locale?: string }): Slug =>
  Slugify.fromLocale(locale).parse(str)

export const contentSlug = ({ name, locale, slugCode }: { name: Slug; locale?: string; slugCode?: string }) => {
  const slug_code = slugCode ? slugify({ str: slugCode, locale }) : newGlyphSlugId()
  const slug_name = slugify({ str: name, locale })
  return `${slug_code}-${slug_name}`
}

const idAlphabet = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-`
const slugAlphabet = `0123456789abcdefghijklmnopqrstuvwxyz`
export const newGlyphSlugId = customAlphabet(slugAlphabet, 12)
export const newGlyphPermId = customAlphabet(idAlphabet, 25)
export const newAuthKey = customAlphabet(idAlphabet, 25)

export const newGlyphIdentifiers = ({
  name,
  locale,
  slugCode,
}: {
  name: string
  locale?: string
  slugCode?: string
}): { _slug: string; _permId: PermId } => {
  const _permId = newGlyphPermId()
  const _slug = contentSlug({ name, slugCode, locale })
  return { _permId, _slug }
}
