import { JsonObject, JsonValue, Primitive } from 'type-fest'

export type GlyphData = JsonObject
export type GlyphContext = Record<string, JsonValue>
export type GlyphId<Type extends GlyphType = GlyphType> = `${Type}/${GlyphKey}`
export type GlyphKey = string
export type GlyphType = string
export type GlyphKind = 'edge' | 'node'
export type GlyphClass<Kind extends GlyphKind = GlyphKind, Type extends GlyphType = GlyphType> = WithType<Type> &
  WithKind<Kind>
export type WithId<Type extends GlyphType = GlyphType> = { _id: GlyphId<Type> }
export type WithKind<Kind extends GlyphKind = GlyphKind> = { _kind: Kind }
export type WithKey = { _key: GlyphKey }
export type WithType<Type extends GlyphType = GlyphType> = { _type: Type }
export type WithData<Data extends GlyphData = GlyphData> = { _data: Data }

export type WithSplitId<Type extends GlyphType = GlyphType> = $<WithKey & WithType<Type>>

export type WithSplitFullId<Kind extends GlyphKind = GlyphKind, Type extends GlyphType = GlyphType> = $<
  WithSplitId<Type> & WithKind<Kind>
>
export type WithFullId<Kind extends GlyphKind = GlyphKind, Type extends GlyphType = GlyphType> = $<
  WithId<Type> & WithKind<Kind>
>

export type WithSomeFullId<Kind extends GlyphKind = GlyphKind, Type extends GlyphType = GlyphType> =
  | WithFullId<Kind, Type>
  | WithSplitFullId<Kind, Type>

export type WithSomeFullIdOf<G extends Glyph = Glyph> = WithSomeFullId<KindOf<G>, TypeOf<G>>

export type WithOptContext = { _ctx?: GlyphContext }

export type AbstractGlyph<
  Kind extends GlyphKind = GlyphKind,
  Type extends GlyphType = GlyphType,
  Data extends GlyphData = GlyphData,
> = $<WithId<Type> & WithKey & WithKind<Kind> & WithType<Type> & WithOptContext & WithData<Data>>

export type KindOf<WK extends WithKind> = WK['_kind']
export type IdOf<WI extends WithId> = WI['_id']
export type TypeOf<WT extends WithType> = WT['_type']
export type DataOf<WD extends WithData> = WD['_data']

export type NodeIntrinsicProps = {}
export type Node<Type extends GlyphType = GlyphType, Data extends GlyphData = GlyphData> = $<
  AbstractGlyph<'node', Type, Data>
>

export type EdgeIntrinsicProps<FromType extends GlyphType = GlyphType, ToType extends GlyphType = GlyphType> = {
  _fromType: FromType
  _from: GlyphId<FromType>
  _toType: ToType
  _to: GlyphId<ToType>
}

export type Edge<
  Type extends GlyphType = GlyphType,
  Data extends GlyphData = GlyphData,
  FromType extends GlyphType = GlyphType,
  ToType extends GlyphType = GlyphType,
> = $<AbstractGlyph<'edge', Type, EdgeIntrinsicProps<FromType, ToType> & Data>>

export type Glyph<Type extends GlyphType = GlyphType, Data extends GlyphData = GlyphData> =
  | Edge<Type, Data>
  | Node<Type, Data>

export type CreateNodePayload<Type extends GlyphType = GlyphType, Data extends GlyphData = GlyphData> = WithType<Type> &
  WithData<Data> &
  NodeIntrinsicProps &
  WithOptContext

export type CreateEdgePayload<Type extends GlyphType = GlyphType, Data extends GlyphData = GlyphData> = WithType<Type> &
  WithData<Data> &
  Pick<EdgeIntrinsicProps, '_from' | '_to'> &
  WithOptContext

///
type $<T> = T extends Primitive | Function ? T : { [K in keyof T]: $<T[K]> }
// type SwitchKind<K extends GlyphKind, OnNode, OnEdge> = K extends 'node' ? OnNode : K extends 'edge' ? OnEdge : never
///
