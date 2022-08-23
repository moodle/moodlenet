import { ExtName } from '@moodlenet/core'
import { ext } from './index'
import { EdgeLink, EdgeLinkIdentifiers, GlyphID, GlyphIdentifier } from './types'

export function getCollectionName(extName: ExtName, collectionBaseName: string) {
  return extName === ext.name
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
