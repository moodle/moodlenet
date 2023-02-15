import type { CreateCollectionOpts, CreateCollectionOptsMap } from '@moodlenet/arangodb'
import * as arangodb from '@moodlenet/arangodb'
// import { getCurrentClientSession, UserId } from '@moodlenet/authentication-manager'
import assert from 'assert'
import { getCollectionName, idOf, keyOf, pkgMetaAccess } from './common/lib.mjs'
import shell from './shell.mjs'
import {
  CreateGlyphsDefOptMap,
  CreateNodeOpts,
  EditNodeOpts,
  GlyphDef,
  GlyphDefsMap,
  GlyphDescriptor,
  GlyphHandle,
  GlyphHandlesMap,
  GlyphIdentifier,
  NodeData,
  NodeGlyph,
  WithMaybeKey,
} from './types.mjs'

// export const contentGraphGlyphs = await shell.call(ensureGlyphs)<ContentGraphGlyphs>({
//   defs: {
//     Created: { collection: { kind: 'edge' } },
//     Updated: { collection: { kind: 'edge' } },
//     Deleted: { collection: { kind: 'edge' } },
//   },
// })

export function metaAccess<T>() {
  const { pkgId } = shell.assertCallInitiator()
  return pkgMetaAccess<T>(pkgId)
}
/*
    ensureGlyphs
    */
export async function ensureGlyphs<Defs extends GlyphDefsMap>({
  defs,
}: {
  defs: CreateGlyphsDefOptMap<Defs>
}): Promise<GlyphHandlesMap<Defs>> {
  const { pkgId } = shell.assertCallInitiator()
  // NOTE: Object.entries looses entry typing!
  const allDefs = Object.keys(defs).map<{
    descriptor: GlyphDescriptor
    collectionOpts: CreateCollectionOpts<any>
    glyphName: string
    fullGlyphName: string
  }>(glyphName => {
    const fullGlyphName = getCollectionName(pkgId, glyphName)
    const glyphOpts = defs[glyphName]
    // NOTE: Object.entries looses entry typing!
    assert(
      glyphOpts,
      `ensureGlyphs defs[${glyphName}] no value? can't happen! Object.entries looses typings..??`,
    )
    const descriptor: GlyphDescriptor = {
      _kind: glyphOpts.collection.kind,
      // _pkg: { glyph: pkgGlyphName, pkgName: extName },
      _glyphname: fullGlyphName,
    }
    return { descriptor, collectionOpts: glyphOpts.collection, glyphName, fullGlyphName }
  })

  const createCollectionOptsMap = allDefs.reduce(
    (_coll_def_opt_map, { fullGlyphName, collectionOpts: opts }) => {
      return { ..._coll_def_opt_map, [fullGlyphName]: opts }
    },
    {} as CreateCollectionOptsMap<any>,
  )

  const collectionsHandles = await shell.call(arangodb.ensureCollections)({
    defs: createCollectionOptsMap,
  })

  const glyphHandlesMap = allDefs.reduce(
    (_glyph_handles_map, { descriptor, glyphName, fullGlyphName }) => {
      const collectionHandle = collectionsHandles[fullGlyphName]
      assert(collectionHandle)
      const glyphHandle: GlyphHandle<any> = {
        _glyphname: descriptor._glyphname,
        _kind: descriptor._kind,
        collectionHandle,
      }
      return { ..._glyph_handles_map, [glyphName]: glyphHandle }
    },
    {} as GlyphHandlesMap<Defs>,
  )

  return glyphHandlesMap
}

/*
    createNode
    */
export async function createNode<
  T extends Record<string, any>,
  GlyphDesc extends GlyphDescriptor<'node', T>,
>(
  glyphHandle: GlyphHandle<GlyphDef<GlyphDesc['_kind'], T>>,
  data: NodeData<GlyphDesc> & WithMaybeKey,
  opts: Partial<CreateNodeOpts> = {},
): Promise<NodeGlyph<GlyphDesc>> {
  type NodeCreateData = WithMaybeKey & Omit<NodeGlyph, '_id' | '_key'>

  const nodeCreateData: NodeCreateData = {
    ...data,
    _glyphname: glyphHandle._glyphname,
    _meta: opts.meta ? metaAccess().nu(opts.meta) : {},
  }
  const q = `INSERT ${JSON.stringify(nodeCreateData)} INTO \`${glyphHandle._glyphname}\` RETURN NEW`
  const nodeGlyph: NodeGlyph<GlyphDesc> = (await shell.call(arangodb.queryRs)({ q })).resultSet[0]

  return nodeGlyph
}

/*
    editNode
    */
export async function editNode<
  T extends Record<string, any>,
  GlyphDesc extends GlyphDescriptor<'node', T>,
>(
  glyphHandle: GlyphHandle<GlyphDef<GlyphDesc['_kind'], T>>,
  identifier: GlyphIdentifier<'node'>,
  data: Partial<NodeData<GlyphDesc>> & WithMaybeKey,
  opts: Partial<EditNodeOpts> = {},
): Promise<null | NodeGlyph<GlyphDesc>> {
  type NodeEditData = WithMaybeKey & Partial<Omit<NodeGlyph, '_id' | '_key'>>
  const nodeEditData: NodeEditData = {
    ...data,
    _meta: opts.meta ? metaAccess().nu(opts.meta) : {},
  }
  const _key = keyOf(identifier)
  const q = `
UPDATE "${_key}" 
  WITH ${JSON.stringify(nodeEditData)} 
  INTO \`${glyphHandle._glyphname}\` 
RETURN NEW`
  const nodeGlyph: null | NodeGlyph<GlyphDesc> = (await shell.call(arangodb.queryRs)({ q }))
    .resultSet[0]
  if (!nodeGlyph) {
    return null
  }
  return nodeGlyph
}

/*
    createEdge
    */
// export async function createEdge<GlyphDesc extends GlyphDescriptor<'edge'>>(
//   glyphDesc: GlyphDesc,
//   data: EdgeData<GlyphDesc> & WithMaybeKey,
//   linkId: EdgeLinkIdentifiers,
//   // _opts: Partial<CreateEdgeOpts> = {},
// ): Promise<EdgeGlyph<GlyphDesc>> {
//   const link = edgeLinkIdentifiers2edgeLink(linkId)
//   const _fromType = link._from.split('/')[0]!
//   const _toType = link._to.split('/')[0]!
//   // const edgeMeta:Omit<EdgeGlyphMeta, '_id' | '_key'>={
//   //   ...glyphDesc,
//   //   ...link,
//   //   _fromType,
//   //   _toType,
//   // }
//   type EdgeCreateData = WithMaybeKey & Omit<EdgeGlyph, '_id' | '_key'>
//   const edgeCreateData: EdgeCreateData = {
//     ...data,
//     ...glyphDesc,
//     ...link,
//     _fromType,
//     _toType,
//   }

//   const q = `
// INSERT ${JSON.stringify(edgeCreateData)}
//   INTO \`${glyphDesc._glyphname}\`
// RETURN NEW`
//   const edgeGlyph: EdgeGlyph<typeof glyphDesc> = (await shell.call(arangodb.queryRs)({ q }))
//     .resultSet[0]

//   return edgeGlyph
// }

export async function readNode<GlyphDesc extends GlyphDescriptor<'node'>>(
  identifier: GlyphIdentifier<'node', GlyphDesc['_glyphname']>,
): Promise<undefined | NodeGlyph<GlyphDesc>> {
  const q = `RETURN DOCUMENT("${idOf(identifier)}")`
  const nodeGlyph: NodeGlyph<any> | undefined = (await shell.call(arangodb.queryRs)({ q }))
    .resultSet[0]
  if (!nodeGlyph) {
    return undefined
  }
  return nodeGlyph
}

export async function queryCgRs({ q, bindVars }: { q: string; bindVars: Record<string, any> }) {
  // console.log({ q, bindVars })
  return shell.call(arangodb.queryRs)({ q, bindVars })
}
