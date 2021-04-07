import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useContentNodeContext } from '../../contexts/ContentNodeContext'
import { useSession } from '../../contexts/Global/Session'
import { isJust } from '../../helpers/data'
import { getRelCount } from '../../helpers/nodeMeta'
import { useMutateEdge } from '../../hooks/content/mutateEdge'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { ResourceCardProps } from '../../ui/components/cards/Resource'
import { CollectionPage, CollectionPageProps } from '../../ui/pages/Collection'
import { useCollectionPageNodeQuery, useCollectionPageResourcesQuery } from './CollectionPage/CollectionPage.gen'

export const CollectionPageComponent: FC<{ id: Id }> = ({ id }) => {
  const { session } = useSession()
  const collectionContext = useContentNodeContext()
  const removeResourceMut = useMutateEdge()

  const collectionRes = useCollectionPageNodeQuery({ variables: { id } })
  const collection = collectionRes.data?.node
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

          return props && ([props, edge] as const)
        })
        .filter(isJust)
        .map(([cardProps, edge]) => ({
          ...cardProps,
          removeResource: collectionContext?.imMaintainer
            ? async () => {
                await removeResourceMut.deleteEdge({ edgeId: edge.edge._id })
                return resourcesRes.refetch()
              }
            : null,
        })),
    [collectionContext?.imMaintainer, removeResourceMut, resourceEdges, resourcesRes],
  )

  const pageHeaderProps = usePageHeaderProps()
  const followMut = useMutateEdge()
  const myFollowId = collection?.myFollow.edges[0]?.edge._id
  const myProfile = session?.profile
  const me = useMemo(() => {
    return myProfile
      ? {
          toggleFollow() {
            if (!myProfile || followMut.createResult.loading || followMut.deleteResult.loading) {
              return
            }
            const toggleFollowPromise = myFollowId
              ? followMut.deleteEdge({ edgeId: myFollowId })
              : followMut.createEdge<'Follows'>({ data: {}, edgeType: 'Follows', from: myProfile._id, to: id })
            toggleFollowPromise.then(() => collectionRes.refetch())
          },
          following: !!myFollowId,
        }
      : null
  }, [followMut, id, myFollowId, collectionRes, myProfile])

  const props = useMemo<CollectionPageProps | null>(() => {
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
          me,
          name: collection.name,
          summary: collection.summary,
          resourceList,
          pageHeaderProps,
        }
      : null
  }, [collection, me, resourceList, pageHeaderProps])

  return props && <CollectionPage {...props} />
}
