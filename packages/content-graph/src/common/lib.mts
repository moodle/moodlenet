import type { PkgIdentifier } from '@moodlenet/core'
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
} from '../types.mjs'

export function getCollectionName(pkgId: PkgIdentifier, collectionBaseName: string) {
  return `${getPkgNamespace(pkgId)}__${collectionBaseName}`
}

export function getPkgNamespace(pkgId: PkgIdentifier) {
  return `${pkgId.name.replace(/^@/, '').replace('/', '__')}`
}

export function glyphIdentifier2glyphID(_: GlyphIdentifier | GlyphID): GlyphID {
  return 'string' === typeof _ ? _ : '_id' in _ ? _._id : `${_._glyphname}/${_._key}`
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
      : `${identifier._glyphname}/${identifier._key}`
    : identifier
}

export function keyOf<GlyphIdentif extends GlyphIdentifier>(identifier: GlyphIdentif): string {
  const _id = idOf(identifier)
  const _key = _id.split('/')[1]
  assert(_key, `keyOf ${_id} no key !`)
  return _key
}

export function pkgMetaAccess<T>(pkgId: PkgIdentifier) {
  const namespace = getPkgNamespace(pkgId)
  const aql = `_meta.${namespace}`
  return {
    namespace,
    aql,
    set,
    get,
    nu,
    meta,
  }
  function set(glyph: Glyph, meta: T) {
    glyph._meta = glyph._meta ?? {}
    glyph._meta[namespace] = meta
  }
  function nu(meta: T) {
    return { [namespace]: meta }
  }
  function meta(meta: T) {
    return meta
  }
  function get(glyph: Glyph) {
    return glyph._meta[namespace] as T | undefined
  }
}
