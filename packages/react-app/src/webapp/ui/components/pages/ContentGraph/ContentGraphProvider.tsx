import { GlyphDescriptor, NodeGlyph } from '@moodlenet/content-graph'
import { ComponentType, createContext, FC, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type NodeHomePageComponent<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> = ComponentType<{
  node: NodeGlyph<GlyphDesc>
}>
export type NodeHomePageDef<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> = {
  Component: NodeHomePageComponent<GlyphDesc>
  type: GlyphDesc['_type']
}
export type ContentGraphContextType = {
  registerNodeHomePage<GlyphDesc extends GlyphDescriptor<'node'>>(_: NodeHomePageDef<GlyphDesc>): unknown
  nodeHomePages: RegisteredNodeHomePages
}

export type RegisteredNodeHomePages = Record<string, NodeHomePageDef<any>>

export const ContentGraphContext = createContext<ContentGraphContextType>(null as any)

export const ContentGraphProvider: FC<PropsWithChildren> = ({ children }) => {
  const [nodeHomePages, setNodeHomePages] = useState<RegisteredNodeHomePages>({})
  const registerNodeHomePage = useCallback<ContentGraphContextType['registerNodeHomePage']>(def => {
    setNodeHomePages(current => ({ ...current, [def.type]: def }))
  }, [])

  const ctx = useMemo<ContentGraphContextType>(() => {
    return { registerNodeHomePage, nodeHomePages }
  }, [registerNodeHomePage, nodeHomePages])

  return <ContentGraphContext.Provider value={ctx}>{children}</ContentGraphContext.Provider>
}
