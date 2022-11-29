import { customAlphabet } from 'nanoid'
import Slugify from 'slugify'
import { PermId, Slug } from '../../content-graph/types/node'

export const slugify = ({ str, locale }: { str: string; locale?: string }): Slug =>
  Slugify(str, { locale, trim: true, lower: true, strict: true, remove: /[*+~.()'"!:@]/g })

export const contentSlug = ({ name, locale, slugCode }: { name: Slug; locale?: string; slugCode?: string }) => {
  const slug_code = slugCode ? slugify({ str: slugCode, locale }) : newGlyphSlugId()
  const slug_name = slugify({ str: name, locale })
  return `${slug_code}-${slug_name}`.substring(0, 75)
}

const idAlphabet = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
const slugAlphabet = `0123456789abcdefghijklmnopqrstuvwxyz`
export const newGlyphSlugId = customAlphabet(slugAlphabet, 12)
export const newGlyphPermId = customAlphabet(idAlphabet, 30)
export const newAuthKey = customAlphabet(idAlphabet, 30)

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
