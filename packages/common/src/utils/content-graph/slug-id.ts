import { customAlphabet, nanoid } from 'nanoid'
import { PermId, Slug } from '../../content-graph/types/node'

const Slugify = require('slugifyjs')
export const slugify = ({ str, locale = 'en' }: { str: string; locale?: string }): Slug =>
  Slugify.fromLocale(locale).parse(str)

export const contentSlug = ({ name, locale, slugCode }: { name: Slug; locale?: string; slugCode?: string }) =>
  `${slugCode ?? newGlyphSlugId()}-${slugify({ str: name, locale })}`

const alphabet = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
export const newGlyphSlugId = customAlphabet(alphabet, 12)
export const newGlyphPermId = () => nanoid(18)
export const newAuthId = () => nanoid(18)

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
