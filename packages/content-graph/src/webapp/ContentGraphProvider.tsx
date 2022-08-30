import { ComponentType, createContext, FC, PropsWithChildren, useCallback, useMemo } from 'react'
import { GlyphDescriptor, NodeGlyph } from '../types'

export type ContentGraphContextType = {
  registerNodeHomePage<GlyphDesc extends GlyphDescriptor<'node'>>(_: {
    component: ComponentType<{ node: NodeGlyph<GlyphDesc> }>
  }): unknown
}

export const ContentGraphContext = createContext<ContentGraphContextType>(null as any)

const ContentGraphProvider: FC<PropsWithChildren> = ({ children }) => {
  const registerNodeHomePage = useCallback<ContentGraphContextType['registerNodeHomePage']>(() => {}, [])

  const ctx = useMemo<ContentGraphContextType>(() => {
    return { registerNodeHomePage }
  }, [registerNodeHomePage])

  return <ContentGraphContext.Provider value={ctx}>{children}</ContentGraphContext.Provider>
}

export default ContentGraphProvider
