import type { CollectionDefOpt, CollectionDefOptMap } from '@moodlenet/arangodb'
import * as arangodb from '@moodlenet/arangodb'
import { getApiCtxClientSession, UserId } from '@moodlenet/authentication-manager'
import kvStore from './kvStore.mjs'
import {
  edgeLinkIdentifiers2edgeLink,
  getCollectionName,
  glyphIdentifier2glyphID,
  idOf,
  keyOf,
} from './pub-lib.mjs'
import shell from './shell.mjs'
import {
  ContentGraphGlyphs,
  CreateEdgeOpts,
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
  GlyphMeta,
  NodeData,
  NodeGlyph,
  WithMaybeKey,
} from './types.mjs'

export const contentGraphGlyphs = await shell.call(ensureGlyphs)<ContentGraphGlyphs>({
  defs: {
    Created: { kind: 'edge' },
    Updated: { kind: 'edge' },
    Deleted: { kind: 'edge' },
  },
})
/*
    ensureGlyphs
    */
export async function ensureGlyphs<Defs extends GlyphDefsMap>({
  defs,
}: {
  defs: GlyphDefOptMap<Defs>
}): Promise<GlyphDescriptorsMap<Defs>> {
  const { pkgId } = shell.assertCallInitiator()
  const allDefs = Object.keys(defs).map<{
    descriptor: GlyphDescriptor
    opts: CollectionDefOpt
    pkgGlyphName: string
    fullGlyphName: string
  }>(pkgGlyphName => {
    const fullGlyphName = getCollectionName(pkgId, pkgGlyphName)
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
  const authenticableByUserId = opts.authenticableBy?.userId
  const nodeCreateData: NodeCreateData = {
    ...data,
    ...glyphDesc,
    _meta: {
      // '@authenticableByUserId': authenticableByUserId,
    },
  }
  const q = `INSERT ${JSON.stringify(nodeCreateData)} INTO \`${glyphDesc._type}\` RETURN NEW`
  const nodeGlyph: NodeGlyph<typeof glyphDesc> = (await shell.call(arangodb.query)({ q }))
    .resultSet[0]
  if (authenticableByUserId) {
    await kvStore.set('userId2NodeAssoc', authenticableByUserId, {
      userId: authenticableByUserId,
      nodeId: {
        _id: nodeGlyph._id,
        _key: nodeGlyph._key,
        _type: nodeGlyph._type,
      },
    })
  }
  if (opts.performerNode) {
    const _creatorId = glyphIdentifier2glyphID(opts.performerNode)
    await createEdge(contentGraphGlyphs.Created, {}, { _from: _creatorId, _to: nodeGlyph._id })
  }

  return nodeGlyph
}

/*
    editNode
    */
export async function editNode<GlyphDesc extends GlyphDescriptor<'node'>>(
  glyphDesc: GlyphDesc,
  identifier: GlyphIdentifier<'node'>,
  data: Partial<NodeData<GlyphDesc>> & WithMaybeKey,
  _opts: Partial<EditNodeOpts> = {},
): Promise<null | NodeGlyph<GlyphDesc>> {
  type NodeEditData = WithMaybeKey & Partial<Omit<NodeGlyph, '_id' | '_key'>>
  const nodeEditData: NodeEditData = {
    ...data,
    _meta: {},
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
  _opts: Partial<CreateEdgeOpts> = {},
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

  // if (opts.performer) {
  //   const _creatorId = glyphIdentifier2glyphID(opts.performer)
  //   await createEdge(contentGraphGlyphs.Created, {}, { _from: _creatorId, _to: edge._id })
  // }

  return edgeGlyph
}

export async function getAuthenticatedNode({
  userId,
}: {
  userId: UserId
}): Promise<undefined | { node: NodeGlyph; meta: GlyphMeta }> {
  const { value } = await kvStore.get('userId2NodeAssoc', userId)
  if (!value) {
    return undefined
  }
  const q = `RETURN DOCUMENT("${value.nodeId._id}")`
  const nodeGlyph: NodeGlyph<any> | undefined = (await shell.call(arangodb.query)({ q }))
    .resultSet[0]
  if (!nodeGlyph) {
    return undefined
  }
  return nodeGlyph
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

export async function getSessionUserNode() {
  const clientSession = await getApiCtxClientSession()
  // console.log('APAP', inspect({ clientSession, ctx }, false, 10, true))
  if (!clientSession?.user) {
    return
  }
  const result = await getAuthenticatedNode({ userId: clientSession.user.id })
  if (!result) {
    return
  }
  return { node: result.node }
}

export async function query({ q, bindVars }: { q: string; bindVars: Record<string, any> }) {
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
