import type { CollectionDefOpt, CollectionDefOptMap, MNArangoDBExt } from '@moodlenet/arangodb'
import type { CoreExt, Ext, ExtDef, ExtId } from '@moodlenet/core'
import type { KeyValueStoreExtDef } from '@moodlenet/key-value-store'
import {
  ContentGraphGlyphs,
  EdgeGlyph,
  GlyphDescriptor,
  GlyphDescriptorsMap,
  Lib,
  NodeData,
  WithCreatorId,
  WithMaybeKey,
} from './types'
import { edgeLinkIdentifiers2edgeLink, getCollectionName, glyphIdentifier2glyphID } from './utils'
export * from './types'

export type ContentGraphStoreExtDef = ExtDef<'@moodlenet/content-graph', '0.1.0', Lib>

export type ContentGraphStoreExt = Ext<ContentGraphStoreExtDef, [CoreExt, MNArangoDBExt, KeyValueStoreExtDef]>

export const ext: ContentGraphStoreExt = {
  name: '@moodlenet/content-graph',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/arangodb@0.1.0', '@moodlenet/key-value-store@0.1.0'],
  async connect(shell) {
    const [, arangoSrv, kvStore] = shell.deps
    const myLib = libFor(true)

    const contentGraphGlyphs = await myLib.ensureGlyphs<ContentGraphGlyphs>({
      defs: {
        Created: { kind: 'edge' },
        Updated: { kind: 'edge' },
        Deleted: { kind: 'edge' },
      },
    })

    shell.onExtUninstalled(async ({ extName }) => {
      const { collectionsMeta } = await arangoSrv.plug.collections()
      const myPrefix = getCollectionName(extName, '')
      await Promise.all(
        collectionsMeta
          .filter(collectionMeta => collectionMeta.name.startsWith(myPrefix))
          .map(collectionMeta => arangoSrv.plug.dropCollection({ name: collectionMeta.name })),
      )
    })
    return {
      deploy() {
        return {
          plug({ shell }) {
            return libFor(shell.extId)
          },
        }
      },
    }

    function libFor(extId: ExtId | true): Lib {
      const { extName } = extId === true ? { extName: ext.name } : shell.lib.splitExtId(extId)
      const lib: Lib = {
        async ensureGlyphs({ defs }) {
          const allDefs = Object.keys(defs).map<{
            descriptor: GlyphDescriptor
            opts: CollectionDefOpt
            pkgGlyphName: string
            fullGlyphName: string
          }>(pkgGlyphName => {
            const fullGlyphName = getCollectionName(extName, pkgGlyphName)
            const glyphOpts = defs[pkgGlyphName]!
            const opts: CollectionDefOpt = {
              kind: glyphOpts.kind,
              opts: glyphOpts.opts,
            }
            const descriptor: GlyphDescriptor = {
              _kind: glyphOpts.kind,
              // _pkg: { glyph: pkgGlyphName, pkgName: extName },
              _type: fullGlyphName,
            }
            return { descriptor, opts, pkgGlyphName, fullGlyphName }
          })

          const collectionsDefOptMap = allDefs.reduce((_coll_def_opt_map, { fullGlyphName: glyphName, opts }) => {
            return { ..._coll_def_opt_map, [glyphName]: opts }
          }, {} as CollectionDefOptMap)

          /* const handles =  */ await arangoSrv.plug.ensureCollections({ defs: collectionsDefOptMap })

          const glyphDescriptorsMap = allDefs.reduce((_glyph_desc_map, { descriptor, pkgGlyphName }) => {
            return { ..._glyph_desc_map, [pkgGlyphName]: descriptor }
          }, {} as GlyphDescriptorsMap<any>)

          return glyphDescriptorsMap
        },
        async createNode(glyphDesc, data, creatorId, _opts = {}) {
          type NodeCreateData = WithMaybeKey & WithCreatorId & Omit<NodeData, '_id' | '_key'>
          const nodeCreateData: NodeCreateData = {
            ...data,
            ...glyphDesc,
            _creatorId: glyphIdentifier2glyphID(creatorId),
          }
          const q = `INSERT ${JSON.stringify(nodeCreateData)} INTO ${glyphDesc._type} RETURN NEW`
          const [node] = await (await arangoSrv.plug.query({ q })).resultSet
          return { node }
        },
        async createEdge(glyphDesc, data, linkId, creatorId, _opts = {}) {
          type EdgeCreateData = WithMaybeKey & WithCreatorId & Omit<EdgeGlyph, '_id' | '_key'>
          const link = edgeLinkIdentifiers2edgeLink(linkId)
          const _fromType = link._from.split('/')[0]!
          const _toType = link._to.split('/')[0]!
          const edgeCreateData: EdgeCreateData = {
            ...data,
            ...glyphDesc,
            ...link,
            _fromType,
            _toType,
            _creatorId: glyphIdentifier2glyphID(creatorId),
          }
          const q = `INSERT ${JSON.stringify(edgeCreateData)} INTO ${glyphDesc._type} RETURN NEW`
          const [edge] = await (await arangoSrv.plug.query({ q })).resultSet

          return { edge }
        },
      }
      return lib
    }
  },
}

export default ext
