import type {
  CollectionDef,
  CollectionDefOpt,
  CollectionKind,
  CollectionOpts,
  MNArangoDBExt,
} from '@moodlenet/arangodb'
import type { AuthenticationManagerExt, UserId } from '@moodlenet/authentication-manager'
import type { CoreExt, Ext, ExtDef, SubTopo } from '@moodlenet/core'
import type { KeyValueStoreExtDef } from '@moodlenet/key-value-store'
import type { ExtModule, ReactAppExt } from '@moodlenet/react-app'
import { ContentGraphContextType } from './webapp/Lib'

export type ContentGraphExtDef = ExtDef<'@moodlenet/content-graph', '0.1.0', Lib, Routes>

export type ContentGraphExt = Ext<
  ContentGraphExtDef,
  [CoreExt, MNArangoDBExt, KeyValueStoreExtDef, AuthenticationManagerExt, ReactAppExt]
>

// type DateString = string
type WithDate<T> = T //& { date: DateString }
export type ContentGraphGlyphs = GlyphDefsMap<{
  Created: { kind: 'edge'; type: WithDate<{}> }
  Updated: { kind: 'edge'; type: WithDate<{}> }
  Deleted: { kind: 'edge'; type: WithDate<{}> }
}>

export type GlyphDef<Kind extends CollectionKind = CollectionKind, Type extends {} = {}> = CollectionDef<Kind, Type>

export type GlyphDefsMap<Defs extends Record<string, GlyphDef> = Record<string, GlyphDef>> = Defs

export type GlyphOpts = { collection?: CollectionOpts }
export type GlyphDefOpt<Kind extends CollectionKind> = CollectionDefOpt<Kind>
export type GlyphDefOptMap<Defs extends GlyphDefsMap = GlyphDefsMap> = {
  readonly [glyphName in keyof Defs]: GlyphDefOpt<Defs[glyphName]['kind']>
}

declare const GLYPH_HANDLE_TYPE_SYMBOL: unique symbol
type GLYPHDESCTYPE_SYMBOL = typeof GLYPH_HANDLE_TYPE_SYMBOL
export type GlyphDescriptor<
  Kind extends CollectionKind = CollectionKind,
  Type extends {} = {},
  // GlyphName extends string = string,
> = {
  _type: string
  _kind: Kind

  // _pkg: { glyph: GlyphName; pkgName: ExtName /* ; version: ExtVersion  */ }
  [GLYPH_HANDLE_TYPE_SYMBOL]?: Type
}

export type GlyphDescriptorsMap<Defs extends GlyphDefsMap = GlyphDefsMap> = {
  readonly [collectionName in string & keyof Defs]: GlyphDescriptor<
    Defs[collectionName]['kind'],
    Defs[collectionName]['type']
    // ,collectionName
  >
}

export type GlyphID = `${string}/${string}`
// type GlyphID = `${string}/${string}` & { [GLYPH_ID_SYMBOL]?: GLYPH_ID_SYMBOL }
// declare const GLYPH_ID_SYMBOL: unique symbol
// type GLYPH_ID_SYMBOL = typeof GLYPH_ID_SYMBOL

export type GlyphIdentifier<Kind extends CollectionKind = CollectionKind, Typename extends string = string> =
  | GlyphID
  | ({
      _kind?: Kind
    } & (
      | {
          _type: Typename
          _key: string
        }
      | {
          _id: GlyphID
        }
    ))

export type BaseGlyphMeta<GlyphDesc extends GlyphDescriptor> = GlyphDesc & {
  _key: string
  _id: GlyphID
} /* & WithCreatorId &  */

export type WithMaybeKey = { _key?: string }

export type NodeGlyphMeta<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> =
  BaseGlyphMeta<GlyphDesc>

export type EdgeLink = {
  _from: GlyphID
  _to: GlyphID
}

export type EdgeLinkIdentifiers = {
  _from: GlyphIdentifier
  _to: GlyphIdentifier
}

export type EdgeLinkType = {
  _fromType: string
  _toType: string
}
export type EdgeGlyphMeta<GlyphDesc extends GlyphDescriptor<'edge'> = GlyphDescriptor<'edge'>> =
  BaseGlyphMeta<GlyphDesc> & EdgeLinkType & EdgeLink

export type EdgeData<GlyphDesc extends GlyphDescriptor<'edge'> = GlyphDescriptor<'edge'>> =
  GlyphDesc[GLYPHDESCTYPE_SYMBOL]
export type EdgeGlyph<GlyphDesc extends GlyphDescriptor<'edge'> = GlyphDescriptor<'edge'>> =
  GlyphDesc[GLYPHDESCTYPE_SYMBOL] & EdgeGlyphMeta<GlyphDesc>

export type NodeData<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> =
  GlyphDesc[GLYPHDESCTYPE_SYMBOL]
export type NodeGlyph<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> =
  GlyphDesc[GLYPHDESCTYPE_SYMBOL] & NodeGlyphMeta<GlyphDesc>

export type Glyph = NodeGlyph | EdgeGlyph

export type WithPerformerNodeIdentifier = { performerNode: GlyphIdentifier<'node'> }
export type CreateNodeOpts = { authenticableBy: { userId: UserId } } & WithPerformerNodeIdentifier
export type CreateEdgeOpts = {} /* & WithPerformerIdentifier */

export type GlyphMeta = {}

export type ContentGraphKVStore = {
  userId2NodeAssoc: {
    userId: UserId
    nodeId: {
      _type: string
      _key: string
      _id: GlyphID
    }
  }
}

export type Lib = {
  ensureGlyphs<Defs extends GlyphDefsMap>(_: { defs: GlyphDefOptMap<Defs> }): Promise<GlyphDescriptorsMap<Defs>>
  createNode<GlyphDesc extends GlyphDescriptor<'node'>>(
    glyphDesc: GlyphDesc,
    data: NodeData<GlyphDesc> & WithMaybeKey,
    opts?: Partial<CreateNodeOpts>,
  ): Promise<{ node: NodeGlyph<GlyphDesc>; meta: GlyphMeta }>
  createEdge<GlyphDesc extends GlyphDescriptor<'edge'>>(
    glyphDesc: GlyphDesc,
    data: EdgeData<GlyphDesc> & WithMaybeKey,
    linkId: EdgeLinkIdentifiers,
    opts?: Partial<CreateEdgeOpts>,
  ): Promise<{ edge: EdgeGlyph<GlyphDesc>; meta: GlyphMeta }>
  getAuthenticatedNode(_: { userId: UserId }): Promise<undefined | { node: NodeGlyph; meta: GlyphMeta }>

  readNode<GlyphDesc extends GlyphDescriptor<'node'>>(_: {
    identifier: GlyphIdentifier<'node'>
  }): Promise<undefined | { node: NodeGlyph<GlyphDesc>; meta: GlyphMeta }>
}

export type Routes = {
  getMyUserNode: SubTopo<void, undefined | { node: NodeGlyph }>
  read: {
    node: SubTopo<{ identifier: GlyphIdentifier<'node'> }, undefined | { node: NodeGlyph }>
  }
}

export type ContentGraphReactAppLib = ExtModule<
  ContentGraphExtDef,
  {
    ContentGraphContext: React.Context<ContentGraphContextType>
  }
>

/* 
declare const lib: Lib
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
