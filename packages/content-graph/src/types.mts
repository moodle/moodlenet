import type {
  CollectionDef,
  CollectionDefOpt,
  CollectionKind,
  CollectionOpts,
} from '@moodlenet/arangodb'
import type { UserId } from '@moodlenet/authentication-manager'

// type DateString = string
type WithDate<T> = T //& { date: DateString }
export type ContentGraphGlyphs = GlyphDefsMap<{
  Created: { kind: 'edge'; type: WithDate<{}> }
  Updated: { kind: 'edge'; type: WithDate<{}> }
  Deleted: { kind: 'edge'; type: WithDate<{}> }
}>

export type GlyphDef<
  Kind extends CollectionKind = CollectionKind,
  Type extends {} = {},
> = CollectionDef<Kind, Type>

export type GlyphDefsMap<Defs extends Record<string, GlyphDef> = Record<string, GlyphDef>> = Defs

export type GlyphOpts = { collection?: CollectionOpts }
export type GlyphDefOpt<Kind extends CollectionKind> = CollectionDefOpt<Kind>
export type GlyphDefOptMap<Defs extends GlyphDefsMap = GlyphDefsMap> = {
  readonly [glyphName in keyof Defs]: GlyphDefOpt<Defs[glyphName]['kind']>
}

// declare const GLYPH_HANDLE_TYPE_SYMBOL: unique symbol
// export type GLYPHDESCTYPE_SYMBOL = typeof GLYPH_HANDLE_TYPE_SYMBOL
export type GlyphDescriptor<
  Kind extends CollectionKind = CollectionKind,
  _Type extends {} = {},
  // GlyphName extends string = string,
> = {
  _type: string
  _kind: Kind

  // _pkg: { glyph: GlyphName; pkgName: ExtName /* ; version: ExtVersion  */ }
  // [GLYPH_HANDLE_TYPE_SYMBOL]?: Type
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

export type GlyphIdentifier<
  Kind extends CollectionKind = CollectionKind,
  Typename extends string = string,
> =
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

export type ContentNode = {
  title: string
  description: string
  //icon:Asset
  //image:Asset
}
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
  GlyphDesc extends GlyphDescriptor<'edge', infer EdgeDataType> ? EdgeDataType : never
/*  GlyphDesc[GLYPHDESCTYPE_SYMBOL]  */
export type EdgeGlyph<GlyphDesc extends GlyphDescriptor<'edge'> = GlyphDescriptor<'edge'>> =
  EdgeData<GlyphDesc> & EdgeGlyphMeta<GlyphDesc>

export type NodeData<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> =
  GlyphDesc extends GlyphDescriptor<'node', infer NodeDataType> ? NodeDataType & ContentNode : never
/*  GlyphDesc[GLYPHDESCTYPE_SYMBOL] & ContentNode */
export type NodeGlyph<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> =
  NodeData<GlyphDesc> & NodeGlyphMeta<GlyphDesc>

export type Glyph = NodeGlyph | EdgeGlyph

export type WithPerformerNodeIdentifier = { performerNode: GlyphIdentifier<'node'> }
export type EditNodeOpts = {} //& WithPerformerNodeIdentifier
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
