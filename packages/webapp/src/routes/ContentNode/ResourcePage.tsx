import { isJust } from '@moodlenet/common/lib/utils/array'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useSession } from '../../context/Global/Session'
import { useMutateEdge } from '../../hooks/content/mutateEdge'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { ResourcePage, ResourcePageProps } from '../../ui/pages/Resource'
import { getJustAssetRefUrl, getMaybeAssetRefUrl } from '../lib'
import {
  // useResourcePageLikeMutation,
  useResourcePageNodeQuery,
} from './ResourcePage/ResourcePage.gen'

export const ResourcePageComponent: FC<{ id: Id }> = ({ id }) => {
  const { currentProfile } = useSession()

  const nodeRes = useResourcePageNodeQuery({ variables: { id } })
  const resource = nodeRes.data?.node
  if (resource && resource.__typename !== 'Resource') {
    throw new Error('never')
  }

  const pageHeaderProps = usePageHeaderProps()

  const likeMut = useMutateEdge()
  const addToCollectionMut = useMutateEdge()
  const myLikeId = resource?.myLike.edges[0]?.edge.id
  const me = useMemo<ResourcePageProps['me']>(() => {
    return currentProfile
      ? {
          toggleLike() {
            if (!currentProfile || likeMut.createResult.loading || likeMut.deleteResult.loading) {
              return
            }
            const toggleLikePromise = myLikeId
              ? likeMut.deleteEdge({ edgeId: myLikeId })
              : likeMut.createEdge<'Likes'>({ data: {}, edgeType: 'Likes', from: currentProfile.id, to: id })
            toggleLikePromise.then(() => nodeRes.refetch())
          },
          liking: !!myLikeId,
          myCollections: currentProfile.myOwnCollections.edges
            .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
            .filter(isJust)
            .map(coll => ({
              icon: getMaybeAssetRefUrl(coll.icon),
              name: coll.name,
              homeLink: contentNodeLink(coll),
              addToThisCollection: () => {
                addToCollectionMut.createEdge({ edgeType: 'Contains', data: {}, from: coll.id, to: id })
              },
            })),
        }
      : null
  }, [currentProfile, myLikeId, likeMut, id, nodeRes, addToCollectionMut])
  const props = useMemo<ResourcePageProps | null>(() => {
    return resource
      ? {
          icon: getMaybeAssetRefUrl(resource.icon),
          resource: getJustAssetRefUrl(resource.asset),
          type: 'pdf',
          creator: {
            homeLink: contentNodeLink({ id: resource._created.by.id }),
            icon: getMaybeAssetRefUrl(resource._created.by.icon),
            name: resource._created.by.name,
          },
          created: resource._created.at,
          likers: resource.likersCount,
          me,
          name: resource.name,
          summary: resource.summary,
          pageHeaderProps,
        }
      : null
  }, [resource, me, pageHeaderProps])
  return props && <ResourcePage {...props} />
}
