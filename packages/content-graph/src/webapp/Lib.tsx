import { ComponentType, createContext } from 'react'
import { GlyphDescriptor, NodeGlyph } from '../types'

export type NodeHomePageDef<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> = {
  Component: ComponentType<{ node: NodeGlyph<GlyphDesc> }>
  type: GlyphDesc['_type']
}
export type ContentGraphContextType = {
  registerNodeHomePage<GlyphDesc extends GlyphDescriptor<'node'>>(_: NodeHomePageDef<GlyphDesc>): unknown
  nodeHomePages: NodeHomePageDef[]
}

export const ContentGraphContext = createContext<ContentGraphContextType>(null as any)

export default { ContentGraphContext }
