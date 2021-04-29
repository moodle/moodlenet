import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { isJust } from '../../helpers/data'
import { useMutateEdge } from '../../hooks/content/mutateEdge'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { ResourcePage, ResourcePageProps } from '../../ui/pages/Resource'
import { getAssetRefUrl } from '../lib'
import {
  // useResourcePageLikeMutation,
  useResourcePageNodeQuery,
} from './ResourcePage/ResourcePage.gen'

export const ResourcePageComponent: FC<{ id: Id }> = ({ id }) => {
  const { session } = useSession()

  const nodeRes = useResourcePageNodeQuery({ variables: { id } })
  const resource = nodeRes.data?.node
  if (resource && resource.__typename !== 'Resource') {
    throw new Error('never')
  }

  const pageHeaderProps = usePageHeaderProps()

  const likeMut = useMutateEdge()
  const addToCollectionMut = useMutateEdge()
  const myLikeId = resource?.myLike.edges[0]?.edge.id
  const myProfile = session?.profile
  const me = useMemo<ResourcePageProps['me']>(() => {
    return myProfile
      ? {
          toggleLike() {
            if (!myProfile || likeMut.createResult.loading || likeMut.deleteResult.loading) {
              return
            }
            const toggleLikePromise = myLikeId
              ? likeMut.deleteEdge({ edgeId: myLikeId })
              : likeMut.createEdge<'Likes'>({ data: {}, edgeType: 'Likes', from: myProfile.id, to: id })
            toggleLikePromise.then(() => nodeRes.refetch())
          },
          liking: !!myLikeId,
          myCollections: myProfile.myOwnCollections.edges
            .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
            .filter(isJust)
            .map(coll => ({
              icon: getAssetRefUrl(coll.icon),
              name: coll.name,
              homeLink: contentNodeLink(coll),
              addToThisCollection: () => {
                addToCollectionMut.createEdge({ edgeType: 'Contains', data: {}, from: coll.id, to: id })
              },
            })),
        }
      : null
  }, [myProfile, myLikeId, likeMut, id, nodeRes, addToCollectionMut])
  const props = useMemo<ResourcePageProps | null>(() => {
    return resource
      ? {
          icon: getAssetRefUrl(resource.icon),
          type: 'pdf',
          creator: {
            homeLink: contentNodeLink({ id: resource._created.by.id }),
            icon: getAssetRefUrl(resource._created.by.icon),
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
