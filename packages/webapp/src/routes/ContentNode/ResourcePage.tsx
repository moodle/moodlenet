import { EdgeType, Id, NodeType } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { getRelCount } from '../../helpers/nodeMeta'
import { getUsePageHeaderProps } from '../../hooks/useProps/PageHeader'
import { ResourcePage, ResourcePageProps } from '../../ui/pages/Resource'
import {
  // useResourcePageFollowMutation,
  useResourcePageNodeQuery,
} from './ResourcePage/ResourcePage.gen'

export const ResourcePageComponent: FC<{ id: Id }> = ({ id }) => {
  // const { session } = useSession()

  const nodeRes = useResourcePageNodeQuery({ variables: { id } })
  const resource = nodeRes.data?.node
  if (resource && resource.__typename !== 'Resource') {
    throw new Error('never')
  }

  // const [follow /* , followResp */] = useResourcePageFollowMutation()
  // const [unfollow /* , unfollowResp */] = useResourcePageUnfollowMutation()
  const usePageHeaderProps = getUsePageHeaderProps()
  const props = useMemo<ResourcePageProps | null>(() => {
    // const myFollowId = resource?.myFollow.edges[0]?.edge._id

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
          likers: getRelCount(resource._meta, EdgeType.Likes, 'from', NodeType.Profile),
          me: /* session?.profile
            ? {
                toggleFollow() {
                  if (!session?.profile) {
                    return
                  }
                  myFollowId
                    ? unfollow({ variables: { edgeId: myFollowId } })
                    : follow({ variables: { resourceId: id, currentProfileId: session.profile._id } })
                },
                following: !!myFollowId,
              }
            : */ null,
          name: resource.name,
          usePageHeaderProps,
        }
      : null
  }, [resource, usePageHeaderProps])
  return props && <ResourcePage {...props} />
}
