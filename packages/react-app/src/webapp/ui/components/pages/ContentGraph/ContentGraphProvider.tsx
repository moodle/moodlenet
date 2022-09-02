import { GlyphDescriptor, NodeGlyph } from '@moodlenet/content-graph'
import { ComponentType, createContext, FC, PropsWithChildren, useCallback, useMemo, useState } from 'react'

export type NodeHomePageDef<GlyphDesc extends GlyphDescriptor<'node'> = GlyphDescriptor<'node'>> = {
  Component: ComponentType<{ node: NodeGlyph<GlyphDesc> }>
  type: GlyphDesc['_type']
}
export type ContentGraphContextType = {
  registerNodeHomePage<GlyphDesc extends GlyphDescriptor<'node'>>(_: NodeHomePageDef<GlyphDesc>): unknown
  nodeHomePages: NodeHomePageDef[]
}

export const ContentGraphContext = createContext<ContentGraphContextType>(null as any)

export const ContentGraphProvider: FC<PropsWithChildren> = ({ children }) => {
  const [nodeHomePages, setNodeHomePages] = useState<NodeHomePageDef[]>([])
  const registerNodeHomePage = useCallback<ContentGraphContextType['registerNodeHomePage']>(def => {
    setNodeHomePages(current => [...current, def as any])
  }, [])

  const ctx = useMemo<ContentGraphContextType>(() => {
    return { registerNodeHomePage, nodeHomePages }
  }, [registerNodeHomePage])

  return <ContentGraphContext.Provider value={ctx}>{children}</ContentGraphContext.Provider>
}
