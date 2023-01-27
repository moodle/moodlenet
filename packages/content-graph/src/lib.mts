import type { CollectionDefOpt, CollectionDefOptMap } from '@moodlenet/arangodb'
import * as arangodb from '@moodlenet/arangodb'
// import { getApiCtxClientSession, UserId } from '@moodlenet/authentication-manager'
import assert from 'assert'
import {
  edgeLinkIdentifiers2edgeLink,
  getCollectionName,
  idOf,
  keyOf,
  pkgMetaAccess,
} from './common/lib.mjs'
import shell from './shell.mjs'
import {
  CreateNodeOpts,
  EdgeData,
  EdgeGlyph,
  EdgeLinkIdentifiers,
  EditNodeOpts,
  GlyphDefOptMap,
  GlyphDefsMap,
  GlyphDescriptor,
  GlyphDescriptorsMap,
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
  defs: GlyphDefOptMap<Defs>
}): Promise<GlyphDescriptorsMap<Defs>> {
  const { pkgId } = shell.assertCallInitiator()
  // NOTE: Object.entries looses entry typing!
  const allDefs = Object.keys(defs).map<{
    descriptor: GlyphDescriptor
    opts: CollectionDefOpt
    pkgGlyphName: string
    fullGlyphName: string
  }>(pkgGlyphName => {
    const fullGlyphName = getCollectionName(pkgId, pkgGlyphName)
    const glyphOpts = defs[pkgGlyphName]
    // NOTE: Object.entries looses entry typing!
    assert(
      glyphOpts,
      `ensureGlyphs defs[${pkgGlyphName}] no value? can't happen! Object.entries looses typings..??`,
    )
    const opts: CollectionDefOpt = {
      kind: glyphOpts.collection.kind,
      opts: glyphOpts.collection.opts,
    }
    const descriptor: GlyphDescriptor = {
      _kind: glyphOpts.collection.kind,
      // _pkg: { glyph: pkgGlyphName, pkgName: extName },
      _type: fullGlyphName,
    }
    return { descriptor, opts, pkgGlyphName, fullGlyphName }
  })

  const collectionsDefOptMap = allDefs.reduce((_coll_def_opt_map, { fullGlyphName, opts }) => {
    return { ..._coll_def_opt_map, [fullGlyphName]: opts }
  }, {} as CollectionDefOptMap)

  /* const handles =  */ await shell.call(arangodb.ensureCollections)({
    defs: collectionsDefOptMap,
  })

  const glyphDescriptorsMap = allDefs.reduce((_glyph_desc_map, { descriptor, pkgGlyphName }) => {
    return { ..._glyph_desc_map, [pkgGlyphName]: descriptor }
  }, {} as GlyphDescriptorsMap<any>)

  return glyphDescriptorsMap
}

/*
    createNode
    */
export async function createNode<GlyphDesc extends GlyphDescriptor<'node'>>(
  glyphDesc: GlyphDesc,
  data: NodeData<GlyphDesc> & WithMaybeKey,
  opts: Partial<CreateNodeOpts> = {},
): Promise<NodeGlyph<GlyphDesc>> {
  type NodeCreateData = WithMaybeKey & Omit<NodeGlyph, '_id' | '_key'>

  const nodeCreateData: NodeCreateData = {
    ...glyphDesc,
    ...data,
    _meta: opts.meta ? metaAccess().nu(opts.meta) : {},
  }
  const q = `INSERT ${JSON.stringify(nodeCreateData)} INTO \`${glyphDesc._type}\` RETURN NEW`
  const nodeGlyph: NodeGlyph<typeof glyphDesc> = (await shell.call(arangodb.query)({ q }))
    .resultSet[0]

  return nodeGlyph
}

/*
    editNode
    */
export async function editNode<GlyphDesc extends GlyphDescriptor<'node'>>(
  glyphDesc: GlyphDesc,
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
  INTO \`${glyphDesc._type}\` 
RETURN NEW`
  const nodeGlyph: null | NodeGlyph<typeof glyphDesc> = (await shell.call(arangodb.query)({ q }))
    .resultSet[0]
  if (!nodeGlyph) {
    return null
  }
  return nodeGlyph
}

/*
    createEdge
    */
export async function createEdge<GlyphDesc extends GlyphDescriptor<'edge'>>(
  glyphDesc: GlyphDesc,
  data: EdgeData<GlyphDesc> & WithMaybeKey,
  linkId: EdgeLinkIdentifiers,
  // _opts: Partial<CreateEdgeOpts> = {},
): Promise<EdgeGlyph<GlyphDesc>> {
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

  const q = `
INSERT ${JSON.stringify(edgeCreateData)}
  INTO \`${glyphDesc._type}\` 
RETURN NEW`
  const edgeGlyph: EdgeGlyph<typeof glyphDesc> = (await shell.call(arangodb.query)({ q }))
    .resultSet[0]

  return edgeGlyph
}

export async function readNode<GlyphDesc extends GlyphDescriptor<'node'>>(
  identifier: GlyphIdentifier<'node', GlyphDesc['_type']>,
): Promise<undefined | NodeGlyph<GlyphDesc>> {
  const q = `RETURN DOCUMENT("${idOf(identifier)}")`
  const nodeGlyph: NodeGlyph<any> | undefined = (await shell.call(arangodb.query)({ q }))
    .resultSet[0]
  if (!nodeGlyph) {
    return undefined
  }
  return nodeGlyph
}

export async function cgQuery({ q, bindVars }: { q: string; bindVars: Record<string, any> }) {
  // console.log({ q, bindVars })
  return shell.call(arangodb.query)({ q, bindVars })
}
/* 
;async () => {
  type MyGDefMap = GlyphDefsMap<{
    NA: { kind: 'node'; type: { na: string } }
    NB: { kind: 'node'; type: { nb: number } }
    EA: { kind: 'edge'; type: { ea: number } }
    EB: { kind: 'edge'; type: { eb: string } }
  }>
  const { EA, EB, NA, NB } = await lib.ensureGlyphs<MyGDefMap>({
    defs: { NA: { kind: 'node' }, NB: { kind: 'node' }, EA: { kind: 'edge' }, EB: { kind: 'edge' } },
  })
  const na = await lib.createNode(NA, { na: '' }, { performerNode: '/' })
  const nb = await lib.createNode(NB, { nb: 1, _key: '11' }, { performerNode: { _type: '', _key: '' } })
  nb.node.nb.toExponential()
  na.node.na.charAt(1)
  const ea = await lib.createEdge(EA, { ea: 0 }, { _from: na.node._id, _to: nb.node._id }, { performerNode: '/' })
  const eb = await lib.createEdge(EB, { eb: 'null ' }, { _from: na.node._id, _to: nb.node._id }, { performerNode: '/' })
  eb.edge.eb.charAt(0)
  ea.edge.ea.toExponential()
}
 */
