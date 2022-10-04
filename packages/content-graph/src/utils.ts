import { ExtName } from '@moodlenet/core'
import { EdgeLink, EdgeLinkIdentifiers, GlyphID, GlyphIdentifier } from './types'

export function getCollectionName(extName: ExtName | true, collectionBaseName: string) {
  return extName === true
    ? collectionBaseName
    : `${extName.replace('@', 'at__').replace('/', '__')}__${collectionBaseName}`
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
