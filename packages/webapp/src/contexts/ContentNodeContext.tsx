import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { createContext, FC, useContext } from 'react'
import { NodeType } from '../graphql/pub.graphql.link'
import { useContentNodeContextQuery } from './ContentNodeContext/ContentNodeContext.gen'
import { useSession } from './Global/Session'

export type ContentNodeContextType = null | {
  type: NodeType
  name: string
  imMaintainer: boolean
  id: Id
  creatorId: Id
}

export const ContentNodeContext = createContext<ContentNodeContextType>(null)
export const useContentNodeContext = () => useContext(ContentNodeContext)
export const ProvideContentNodeContext: FC<{ type: NodeType; id: Id }> = ({ id, type, children }) => {
  const myProfileId = useSession().session?.profile?.id
  const res = useContentNodeContextQuery({
    variables: { id: id },
    fetchPolicy: 'cache-only',
    nextFetchPolicy: 'cache-only',
  })
  const value: ContentNodeContextType = !res.data?.node
    ? null
    : (() => {
        const creatorId = res.data.node._created.by.id
        const name = res.data.node.name
        const imMaintainer = myProfileId === creatorId
        return {
          id: id,
          type,
          creatorId,
          name,
          imMaintainer,
        }
      })()
  return <ContentNodeContext.Provider value={value}>{children}</ContentNodeContext.Provider>
}
