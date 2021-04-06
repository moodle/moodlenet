import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { createContext, FC, useContext } from 'react'
import { NodeType } from '../graphql/pub.graphql.link'

export type ContentNodeContextType = null | {
  type: NodeType
  _id: Id
}

export const ContentNodeContext = createContext<ContentNodeContextType>(null)
export const useContentNodeContext = () => useContext(ContentNodeContext)
export const ProvideContentNodeContext: FC<{ type: NodeType; _id: Id }> = ({ _id, type, children }) => {
  const value: ContentNodeContextType = {
    _id,
    type,
  }
  return <ContentNodeContext.Provider value={value}>{children}</ContentNodeContext.Provider>
}
