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
export const ProvideContentNodeContext: FC<{ type: NodeType; _id: Id }> = ({ _id, type, children }) => {
  const myProfileId = useSession().session?.profile?._id
  const res = useContentNodeContextQuery({
    variables: { id: _id },
    fetchPolicy: 'cache-only',
    nextFetchPolicy: 'cache-only',
  })
  const value: ContentNodeContextType = !res.data?.node
    ? null
    : (() => {
        const creatorId = res.data.node._meta.creator._id
        const name = res.data.node.name
        const imMaintainer = myProfileId === creatorId
        return {
          id: _id,
          type,
          creatorId,
          name,
          imMaintainer,
        }
      })()
  return <ContentNodeContext.Provider value={value}>{children}</ContentNodeContext.Provider>
}
