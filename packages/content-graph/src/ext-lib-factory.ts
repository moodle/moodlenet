import { CollectionDefOpt, CollectionDefOptMap } from '@moodlenet/arangodb'
import { ExtId, ExtShell } from '@moodlenet/core'
import type { ContentGraphStoreExt } from './index'
import {
  ContentGraphGlyphs,
  EdgeGlyph,
  GlyphDescriptor,
  GlyphDescriptorsMap,
  Lib,
  NodeGlyph,
  WithMaybeKey,
} from './types'
import { edgeLinkIdentifiers2edgeLink, getCollectionName, glyphIdentifier2glyphID } from './utils'

export async function extLibForFactory(shell: ExtShell<ContentGraphStoreExt>) {
  const [, arangoSrv /* , kvStore */] = shell.deps
  const contentGraphGlyphs = await libFor(true).ensureGlyphs<ContentGraphGlyphs>({
    defs: {
      Created: { kind: 'edge' },
      Updated: { kind: 'edge' },
      Deleted: { kind: 'edge' },
    },
  })

  return libFor
  function libFor(extId: ExtId | true): Lib {
    const { extName } = extId === true ? { extName: true as const } : shell.lib.splitExtId(extId)

    /*
    ensureGlyphs
    */
    const ensureGlyphs: Lib['ensureGlyphs'] = async ({ defs }) => {
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
    }

    /*
    createNode
    */
    const createNode: Lib['createNode'] = async (glyphDesc, data, opts = {}) => {
      type NodeCreateData = WithMaybeKey & Omit<NodeGlyph, '_id' | '_key'>
      const nodeCreateData: NodeCreateData = {
        ...data,
        ...glyphDesc,
      }
      const q = `INSERT ${JSON.stringify(nodeCreateData)} INTO ${glyphDesc._type} RETURN NEW`
      const node: NodeGlyph<typeof glyphDesc> = (await arangoSrv.plug.query({ q })).resultSet[0]
      if (opts.performerNode) {
        const _creatorId = glyphIdentifier2glyphID(opts.performerNode)
        await createEdge(contentGraphGlyphs.Created, {}, { _from: _creatorId, _to: node._id })
      }
      return { node }
    }

    /*
    createEdge
    */
    const createEdge: Lib['createEdge'] = async (glyphDesc, data, linkId, _opts = {}) => {
      const link = edgeLinkIdentifiers2edgeLink(linkId)
      const _fromType = link._from.split('/')[0]!
      const _toType = link._to.split('/')[0]!
      // const edgeMeta:Omit<EdgeGlyphMeta, '_id' | '_key'>={
      //   ...glyphDesc,
      //   ...link,
      //   _fromType,
      //   _toType,
      // }
      type EdgeCreateData = WithMaybeKey & Omit<EdgeGlyph, '_id' | '_key'>
      const edgeCreateData: EdgeCreateData = {
        ...data,
        ...glyphDesc,
        ...link,
        _fromType,
        _toType,
      }

      const q = `INSERT ${JSON.stringify(edgeCreateData)} INTO ${glyphDesc._type} RETURN NEW`
      const edge: EdgeGlyph<typeof glyphDesc> = (await arangoSrv.plug.query({ q })).resultSet[0]

      // if (opts.performer) {
      //   const _creatorId = glyphIdentifier2glyphID(opts.performer)
      //   await createEdge(contentGraphGlyphs.Created, {}, { _from: _creatorId, _to: edge._id })
      // }

      return { edge }
    }

    /**/
    return {
      ensureGlyphs,
      createNode,
      createEdge,
    }
  }
}
