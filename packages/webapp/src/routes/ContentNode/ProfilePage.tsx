import { EdgeType, Id, NodeType } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { isJust } from '../../helpers/data'
import { getRelCount } from '../../helpers/nodeMeta'
import { getUsePageHeaderProps } from '../../hooks/useProps/PageHeader'
import { CollectionCardProps } from '../../ui/components/cards/Collection'
import { ResourceCardProps } from '../../ui/components/cards/Resource'
import { ProfilePage, ProfilePageProps } from '../../ui/pages/Profile'
import {
  useProfilePageNodeQuery,
  // useProfilePageFollowMutation,
  useProfilePageOwnCollectionsQuery,
  useProfilePageOwnResourcesQuery,
} from './ProfilePage/ProfilePage.gen'

export const ProfilePageComponent: FC<{ id: Id }> = ({ id }) => {
  const { session } = useSession()

  const nodeRes = useProfilePageNodeQuery({
    variables: { id, followable: !!session?.profile && id !== session.profile._id },
  })

  const profile = nodeRes.data?.node
  if (profile && profile.__typename !== 'Profile') {
    throw new Error('never')
  }

  // const [follow /* , followResp */] = useProfilePageFollowMutation()
  // const [unfollow /* , unfollowResp */] = useProfilePageUnfollowMutation()
  const usePageHeaderProps = getUsePageHeaderProps()

  const resourcesRes = useProfilePageOwnResourcesQuery({ variables: { id } })
  const resourceEdges = resourcesRes.data?.node?.ownResources.edges
  const resources = useMemo<ProfilePageProps['resources']>(
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

  const collectionsRes = useProfilePageOwnCollectionsQuery({ variables: { id } })
  const collectionEdges = collectionsRes.data?.node?.ownCollections.edges
  const collections = useMemo<ProfilePageProps['collections']>(
    () =>
      (collectionEdges ?? [])
        .map(edge => {
          if (edge.node.__typename !== 'Collection') {
            return null
          }
          const { name, icon, _id, _meta } = edge.node
          const props: CollectionCardProps = {
            name,
            icon: icon ?? '',
            homeLink: contentNodeLink({ _id }),
            followers: getRelCount(_meta, EdgeType.Follows, 'from', NodeType.Profile),
            resources: getRelCount(_meta, EdgeType.Contains, 'to', NodeType.Resource),
          }

          return props
        })
        .filter(isJust),
    [collectionEdges],
  )

  const props = useMemo<ProfilePageProps | null>(() => {
    // const myFollowId = profile?.myFollow.edges[0]?.edge._id

    return profile
      ? {
          resources,
          collections,
          summary: profile.summary,
          icon: profile.icon || '',
          followers: getRelCount(profile._meta, EdgeType.Follows, 'from', NodeType.Profile),
          me: /* session?.profile
            ? {
                toggleFollow() {
                  if (!session?.profile) {
                    return
                  }
                  myFollowId
                    ? unfollow({ variables: { edgeId: myFollowId } })
                    : follow({ variables: { profileId: id, currentProfileId: session.profile._id } })
                },
                following: !!myFollowId,
              }
            : */ null,
          name: profile.name,
          usePageHeaderProps,
        }
      : null
  }, [collections, profile, resources, usePageHeaderProps])
  console.log({ props, collectionsRes, resourcesRes })
  return props && <ProfilePage {...props} />
}
