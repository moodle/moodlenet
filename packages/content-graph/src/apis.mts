import { getApiCtxClientSession } from '../../authentication-manager/dist/init.mjs'
import { defApi } from '@moodlenet/core'
import { createNode, editNode, ensureGlyphs, getAuthenticatedNode, readNode } from './lib.mjs'
import {
  CreateNodeOpts,
  GlyphDefOptMap,
  GlyphDefsMap,
  GlyphDescriptor,
  GlyphIdentifier,
  GlyphMeta,
  NodeData,
  NodeGlyph,
  WithMaybeKey,
} from './types.mjs'

export default {
  getMyUserNode: defApi(
    ctx => async () => {
      const clientSession = await getApiCtxClientSession({ ctx })
      // console.log('APAP', inspect({ clientSession, ctx }, false, 10, true))
      if (!clientSession?.user) {
        return
      }
      const result = await getAuthenticatedNode({ userId: clientSession.user.id })
      if (!result) {
        return
      }
      return { node: result.node }
    },
    () => true,
  ),
  node: {
    read: defApi(
      _ctx =>
        async <GlyphDesc extends GlyphDescriptor<'node'>>(identifier: GlyphIdentifier<'node'>) => {
          const result = await readNode<GlyphDesc>(identifier)
          return result && { node: result.node }
        },
      () => true,
    ),
    edit: defApi(
      _ctx =>
        async <GlyphDesc extends GlyphDescriptor<'node'>>(
          glyphDesc: GlyphDesc,
          identifier: GlyphIdentifier<'node'>,
          data: Partial<NodeData<GlyphDesc>> & WithMaybeKey,
        ) => {
          const result = await editNode<GlyphDesc>(glyphDesc, identifier, data)
          return result && { node: result.node }
        },
      () => true,
    ),
    create: defApi(
      _ctx =>
        async <GlyphDesc extends GlyphDescriptor<'node'>>(
          glyphDesc: GlyphDesc,
          data: NodeData<GlyphDesc> & WithMaybeKey,
          opts: Partial<CreateNodeOpts> = {},
        ): Promise<{ node: NodeGlyph<GlyphDesc>; meta: GlyphMeta }> => {
          const result = await createNode(glyphDesc, data, opts)
          return result
        },
      () => true,
    ),
  },
  ensureGlyphs: defApi(
    ctx =>
      async <Defs extends GlyphDefsMap>({ defs }: { defs: GlyphDefOptMap<Defs> }) => {
        return ensureGlyphs({
          defs,
          pkgId: ctx.caller.pkgId,
        })
      },
    () => true,
  ),
}
