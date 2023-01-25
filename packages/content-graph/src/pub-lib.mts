import { PkgIdentifier } from '@moodlenet/core'
import assert from 'assert'
import {
  EdgeGlyph,
  EdgeLink,
  EdgeLinkIdentifiers,
  Glyph,
  GlyphID,
  GlyphIdentifier,
  GlyphMeta,
  NodeGlyph,
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

export function extractGlyphMeta<G extends Glyph>(
  _glyph: G,
): { glyph: Omit<G, '_meta'>; meta: GlyphMeta } {
  const { _meta: meta, ...glyph } = _glyph
  return { glyph, meta }
}

export function extractNodeMeta<N extends NodeGlyph>(node: N) {
  const { glyph, meta } = extractGlyphMeta(node)
  return { node: glyph, meta }
}

export function extractEdgeMeta<E extends EdgeGlyph>(edge: E) {
  const { glyph, meta } = extractGlyphMeta(edge)
  return { edge: glyph, meta }
}

export function idOf<GlyphIdentif extends GlyphIdentifier>(identifier: GlyphIdentif): GlyphID {
  return typeof identifier === 'object'
    ? '_id' in identifier
      ? identifier._id
      : `${identifier._type}/${identifier._key}`
    : identifier
}

export function keyOf<GlyphIdentif extends GlyphIdentifier>(identifier: GlyphIdentif): string {
  const _id = idOf(identifier)
  const _key = _id.split('/')[1]
  assert(_key, `keyOf ${_id} no key !`)
  return _key
}
