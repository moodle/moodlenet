import type {
  CollectionHandle,
  CollectionKind,
  CreateCollectionDef,
  CreateCollectionOpts,
} from '@moodlenet/arangodb'

// type DateString = string
type WithDate<T> = T //& { date: DateString }
export type ContentGraphGlyphs = {
  Created: { kind: 'edge'; type: WithDate<Record<string, never>> }
  Updated: { kind: 'edge'; type: WithDate<Record<string, never>> }
  Deleted: { kind: 'edge'; type: WithDate<Record<string, never>> }
}

export type GlyphDef<
  Kind extends CollectionKind = CollectionKind,
  Type extends Record<string, unknown> = Record<string, unknown>,
> = CreateCollectionDef<Kind, Type>

export type GlyphDefsMap<Defs extends Record<string, GlyphDef> = Record<string, GlyphDef>> = Defs

// export type GlyphOpts = { collection?: CollectionOpts }
export type CreateGlyphDefOpt<Def extends GlyphDef> = {
  collection: CreateCollectionOpts<Def>
}
export type CreateGlyphsDefOptMap<Defs extends GlyphDefsMap = GlyphDefsMap> = {
  readonly [glyphName in keyof Defs]: CreateGlyphDefOpt<Defs[glyphName]>
}

// declare const GLYPH_HANDLE_TYPE_SYMBOL: unique symbol
// export type GLYPHDESCTYPE_SYMBOL = typeof GLYPH_HANDLE_TYPE_SYMBOL
export type GlyphDescriptor<
  Kind extends CollectionKind = CollectionKind,
  _DataType extends Record<string, unknown> = Record<string, unknown>,
  // GlyphName extends string = string,
> = {
  _glyphname: string //FIXME: rename to _typename ?
  _kind: Kind

  // _pkg: { glyph: GlyphName; pkgName: ExtName /* ; version: ExtVersion  */ }
  // [GLYPH_HANDLE_TYPE_SYMBOL]?: Type
}

export type GlyphHandle<Def extends GlyphDef> = GlyphDescriptor<Def['kind'], Def['dataType']> & {
  collectionHandle: CollectionHandle<Def>
}

export type GlyphHandlesMap<Defs extends GlyphDefsMap = GlyphDefsMap> = {
  readonly [collectionName in string & keyof Defs]: GlyphHandle<Defs[collectionName]>
}

export type GlyphDescriptorsMap<Defs extends GlyphDefsMap = GlyphDefsMap> = {
  readonly [collectionName in string & keyof Defs]: GlyphDescriptor<
    Defs[collectionName]['kind'],
    Defs[collectionName]['dataType']
    // ,collectionName
  >
}

export type GlyphID = `${string}/${string}`
// type GlyphID = `${string}/${string}` & { [GLYPH_ID_SYMBOL]?: GLYPH_ID_SYMBOL }
// declare const GLYPH_ID_SYMBOL: unique symbol
// type GLYPH_ID_SYMBOL = typeof GLYPH_ID_SYMBOL

export type GlyphIdentifier<
  Kind extends CollectionKind = CollectionKind,
  Glyphname extends string = string,
> =
  | GlyphID
  | ({
      _kind?: Kind
    } & (
      | {
          _glyphname: Glyphname
          _key: string
        }
      | {
          _id: GlyphID
        }
    ))

export type GlyphIdDescriptor<GlyphDesc extends GlyphDescriptor> = GlyphDesc & {
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
export type NodeGlyphIdDescriptor<
  GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>,
> = GlyphIdDescriptor<GlyphDesc>

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
export type EdgeGlyphIdDescriptor<
  GlyphDesc extends GlyphDescriptor<'edge'> = GlyphDescriptor<'edge'>,
> = GlyphIdDescriptor<GlyphDesc> & EdgeLinkType & EdgeLink

export type EdgeData<GlyphDesc extends GlyphDescriptor<'edge'> = GlyphDescriptor<'edge'>> =
  GlyphDesc extends GlyphDescriptor<'edge', infer EdgeDataType> ? EdgeDataType : never
/*  GlyphDesc[GLYPHDESCTYPE_SYMBOL]  */
export type EdgeGlyph<GlyphDesc extends GlyphDescriptor<'edge'> = GlyphDescriptor<'edge'>> =
  EdgeData<GlyphDesc> & EdgeGlyphIdDescriptor<GlyphDesc> & WithGlyphMeta

export type NodeData<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> =
  GlyphDesc extends GlyphDescriptor<'node', infer NodeDataType> ? NodeDataType & ContentNode : never
/*  GlyphDesc[GLYPHDESCTYPE_SYMBOL] & ContentNode */
export type NodeGlyph<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> =
  NodeData<GlyphDesc> & NodeGlyphIdDescriptor<GlyphDesc> & WithGlyphMeta

export type Glyph = NodeGlyph | EdgeGlyph

export type EditNodeOpts = { meta: GlyphMeta } //& WithPerformerNodeIdentifier
export type CreateNodeOpts = Record<string, never>
export type CreateEdgeOpts = Record<string, never>

export type GlyphMeta = Record<string, unknown>
export type WithGlyphMeta = { _meta: GlyphMeta }

export type GlyphsMapOf<GlyphDescMap extends GlyphDescriptorsMap> = {
  [name in keyof GlyphDescMap]: GlyphsOf<GlyphDescMap[name]>
}

export type GlyphsOf<GlyphDesc extends GlyphDescriptor> = GlyphDesc extends GlyphDescriptor<
  'node',
  infer Type
>
  ? NodeGlyph<GlyphDescriptor<'node', Type>>
  : GlyphDesc extends GlyphDef<'edge', infer Type>
  ? EdgeGlyph<GlyphDescriptor<'edge', Type>>
  : never
