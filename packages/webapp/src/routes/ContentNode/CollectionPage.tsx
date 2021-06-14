import { isJust } from '@moodlenet/common/lib/utils/array'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useContentNodeContext } from '../../contexts/ContentNodeContext'
import { useSession } from '../../contexts/Global/Session'
import { useMutateEdge } from '../../hooks/content/mutateEdge'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { ResourceCardProps } from '../../ui/components/cards/Resource'
import { CollectionPage, CollectionPageProps } from '../../ui/pages/Collection'
import { getMaybeAssetRefUrl } from '../lib'
import { useCollectionPageNodeQuery, useCollectionPageResourcesQuery } from './CollectionPage/CollectionPage.gen'

export const CollectionPageComponent: FC<{ id: Id }> = ({ id }) => {
  const { currentProfile } = useSession()
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
          const { collections, name, icon, id } = edge.node
          const props: ResourceCardProps = {
            name,
            icon: getMaybeAssetRefUrl(icon),
            homeLink: contentNodeLink({ id }),
            type: 'pdf',
            collections: collections.edges
              .map(edge => {
                if (edge.node.__typename !== 'Collection') {
                  return null
                }
                const { id, name } = edge.node
                return {
                  homeLink: contentNodeLink({ id }),
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
                await removeResourceMut.deleteEdge({ edgeId: edge.edge.id })
                return resourcesRes.refetch()
              }
            : null,
        })),
    [collectionContext?.imMaintainer, removeResourceMut, resourceEdges, resourcesRes],
  )

  const pageHeaderProps = usePageHeaderProps()
  const followMut = useMutateEdge()
  const myFollowId = collection?.myFollow.edges[0]?.edge.id
  const me = useMemo(() => {
    return currentProfile
      ? {
          toggleFollow() {
            if (!currentProfile || followMut.createResult.loading || followMut.deleteResult.loading) {
              return
            }
            const toggleFollowPromise = myFollowId
              ? followMut.deleteEdge({ edgeId: myFollowId })
              : followMut.createEdge<'Follows'>({ data: {}, edgeType: 'Follows', from: currentProfile.id, to: id })
            toggleFollowPromise.then(() => collectionRes.refetch())
          },
          following: !!myFollowId,
        }
      : null
  }, [followMut, id, myFollowId, collectionRes, currentProfile])

  const props = useMemo<CollectionPageProps | null>(() => {
    return collection
      ? {
          creator: {
            homeLink: contentNodeLink({ id: collection._created.by.id }),
            icon: getMaybeAssetRefUrl(collection._created.by.icon),
            name: collection._created.by.name,
          },
          icon: getMaybeAssetRefUrl(collection.icon),
          lastUpdated: collection._created.at,
          followers: collection.followersCount,
          resources: collection.resourcesCount,
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
