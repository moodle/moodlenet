import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { isJust } from '../../helpers/data'
import { getRelCount } from '../../helpers/nodeMeta'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { ResourceCardProps } from '../../ui/components/cards/Resource'
import { CollectionPage, CollectionPageProps } from '../../ui/pages/Collection'
import {
  // useCollectionPageFollowMutation,
  useCollectionPageNodeQuery,
  useCollectionPageResourcesQuery,
} from './CollectionPage/CollectionPage.gen'

export const CollectionPageComponent: FC<{ id: Id }> = ({ id }) => {
  // const { session } = useSession()

  const nodeRes = useCollectionPageNodeQuery({ variables: { id } })
  const collection = nodeRes.data?.node
  if (collection && collection.__typename !== 'Collection') {
    throw new Error('never')
  }

  const resourcesRes = useCollectionPageResourcesQuery({ variables: { id } })
  const resourceEdges = resourcesRes.data?.node?.resourceList.edges
  const resourceList = useMemo<CollectionPageProps['resourceList']>(
    () =>
      (resourceEdges ?? [])
        .map(edge => {
          if (edge.node.__typename !== 'Resource') {
            return null
          }
          const { collections, name, icon, _id } = edge.node
          const props: ResourceCardProps = {
            name,
            icon: icon ?? '',
            homeLink: contentNodeLink({ _id }),
            type: 'pdf',
            collections: collections.edges
              .map(edge => {
                if (edge.node.__typename !== 'Collection') {
                  return null
                }
                const { _id, name } = edge.node
                return {
                  homeLink: contentNodeLink({ _id }),
                  name,
                }
              })
              .filter(isJust),
          }

          return props
        })
        .filter(isJust),
    [resourceEdges],
  )

  // const [follow /* , followResp */] = useCollectionPageFollowMutation()
  // const [unfollow /* , unfollowResp */] = useCollectionPageUnfollowMutation()
  const pageHeaderProps = usePageHeaderProps()
  const props = useMemo<CollectionPageProps | null>(() => {
    // const myFollowId = collection?.myFollow.edges[0]?.edge._id
    return collection
      ? {
          creator: {
            homeLink: contentNodeLink({ _id: collection._meta.creator._id }),
            icon: collection._meta.creator.icon || '',
            name: collection._meta.creator.name,
          },
          icon: collection.icon || '',
          lastUpdated: collection._meta.created,
          followers: getRelCount(collection._meta, 'Follows', 'from', 'Profile'),
          resources: getRelCount(collection._meta, 'Contains', 'to', 'Resource'),
          me: /* session?.profile
            ? {
                toggleFollow() {
                  if (!session?.profile) {
                    return
                  }
                  myFollowId
                    ? unfollow({ variables: { edgeId: myFollowId } })
                    : follow({ variables: { collectionId: id, currentProfileId: session.profile._id } })
                },
                following: !!myFollowId,
              }
            : */ null,
          name: collection.name,
          resourceList,
          pageHeaderProps,
        }
      : null
  }, [collection, resourceList, pageHeaderProps])
  return props && <CollectionPage {...props} />
}
