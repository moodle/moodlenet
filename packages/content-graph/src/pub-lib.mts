import { PkgIdentifier } from '@moodlenet/core'
import {
  EdgeLink,
  EdgeLinkIdentifiers,
  Glyph,
  GlyphID,
  GlyphIdentifier,
  GlyphMeta,
} from './types.mjs'

export function getCollectionName(pkgId: PkgIdentifier | false, collectionBaseName: string) {
  return !pkgId
    ? collectionBaseName
    : `${pkgId.name.replace('@', 'at__').replace('/', '__')}__${collectionBaseName}`
}

export function glyphIdentifier2glyphID(_: GlyphIdentifier | GlyphID): GlyphID {
  return 'string' === typeof _ ? _ : '_id' in _ ? _._id : `${_._type}/${_._key}`
}

export function edgeLinkIdentifiers2edgeLink(_: EdgeLinkIdentifiers): EdgeLink {
  return {
    _from: glyphIdentifier2glyphID(_._from),
    _to: glyphIdentifier2glyphID(_._to),
  }
}

export function extractGlyphMeta<G extends Glyph>(_glyph: G): { glyph: G; meta: GlyphMeta } {
  const glyph: any = { ..._glyph }
  const meta = glyph._meta
  delete glyph._meta
  return { glyph, meta }
}

export function idOf<GlyphIdentif extends GlyphIdentifier>(identifier: GlyphIdentif): GlyphID {
  return typeof identifier === 'string'
    ? identifier
    : '_id' in identifier
    ? identifier._id
    : `${identifier._type}/${identifier._key}`
}

export function keyOf<GlyphIdentif extends GlyphIdentifier>(identifier: GlyphIdentif): string {
  return typeof identifier === 'string'
    ? identifier.split('/')[1]!
    : '_id' in identifier
    ? identifier._id.split('/')[1]!
    : identifier._key
}
