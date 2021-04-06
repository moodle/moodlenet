import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { getRelCount } from '../../helpers/nodeMeta'
import { useMutateEdge } from '../../hooks/content/mutateEdge'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { ResourcePage, ResourcePageProps } from '../../ui/pages/Resource'
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
  const myLikeId = resource?.myLike.edges[0]?.edge._id
  const myProfile = session?.profile
  const me = useMemo(() => {
    return myProfile
      ? {
          toggleLike() {
            if (!myProfile || likeMut.createResult.loading || likeMut.deleteResult.loading) {
              return
            }
            const toggleLikePromise = myLikeId
              ? likeMut.deleteEdge({ edgeId: myLikeId })
              : likeMut.createEdge<'Likes'>({ data: {}, edgeType: 'Likes', from: myProfile._id, to: id })
            toggleLikePromise.then(() => nodeRes.refetch())
          },
          liking: !!myLikeId,
        }
      : null
  }, [likeMut, id, myLikeId, nodeRes, myProfile])
  const props = useMemo<ResourcePageProps | null>(() => {
    return resource
      ? {
          icon: resource.icon || '',
          type: 'pdf',
          creator: {
            homeLink: contentNodeLink({ _id: resource._meta.creator._id }),
            icon: resource._meta.creator.icon || '',
            name: resource._meta.creator.name,
          },
          created: resource._meta.created,
          likers: getRelCount(resource._meta, 'Likes', 'from', 'Profile'),
          me,
          name: resource.name,
          pageHeaderProps,
        }
      : null
  }, [resource, me, pageHeaderProps])
  return props && <ResourcePage {...props} />
}
