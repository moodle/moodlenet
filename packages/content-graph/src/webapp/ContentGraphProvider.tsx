import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { ContentGraphContext, ContentGraphContextType, NodeHomePageDef } from './Lib'

const ContentGraphProvider: FC<PropsWithChildren> = ({ children }) => {
  const [nodeHomePages, setNodeHomePages] = useState<NodeHomePageDef[]>([])
  const registerNodeHomePage = useCallback<ContentGraphContextType['registerNodeHomePage']>(def => {
    setNodeHomePages(current => [...current, def as any])
  }, [])

  const ctx = useMemo<ContentGraphContextType>(() => {
    return { registerNodeHomePage, nodeHomePages }
  }, [registerNodeHomePage])

  return <ContentGraphContext.Provider value={ctx}>{children}</ContentGraphContext.Provider>
}

export default ContentGraphProvider
