import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { contentNodeLink } from '@moodlenet/common/lib/webapp/sitemap'
import { FC, useMemo } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { isJust } from '../../helpers/data'
import { useMutateEdge } from '../../hooks/content/mutateEdge'
import { usePageHeaderProps } from '../../hooks/props/PageHeader'
import { CollectionCardProps } from '../../ui/components/cards/Collection'
import { ResourceCardProps } from '../../ui/components/cards/Resource'
import { ProfilePage, ProfilePageProps } from '../../ui/pages/Profile'
import { getAssetRefUrl } from '../lib'
import {
  useProfilePageNodeQuery,
  // useProfilePageFollowMutation,
  useProfilePageOwnCollectionsQuery,
  useProfilePageOwnResourcesQuery,
} from './ProfilePage/ProfilePage.gen'

export const ProfilePageComponent: FC<{ id: Id }> = ({ id }) => {
  const { session } = useSession()

  const isMyProfilePage = !!session?.profile && id === session.profile.id

  const nodeRes = useProfilePageNodeQuery({
    variables: { id, skipMyRel: isMyProfilePage },
  })

  const profile = nodeRes.data?.node
  if (profile && profile.__typename !== 'Profile') {
    throw new Error('never')
  }

  const pageHeaderProps = usePageHeaderProps()

  const resourcesRes = useProfilePageOwnResourcesQuery({ variables: { id } })
  const resourceEdges = resourcesRes.data?.node?.ownResources.edges
  const resources = useMemo<ProfilePageProps['resources']>(
    () =>
      (resourceEdges ?? [])
        .map(edge => {
          if (edge.node.__typename !== 'Resource') {
            return null
          }
          const { collections, name, icon, id } = edge.node
          const props: ResourceCardProps = {
            name,
            icon: getAssetRefUrl(icon),
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
          const { name, icon, id, followersCount, resourcesCount } = edge.node
          const props: CollectionCardProps = {
            name,
            icon: getAssetRefUrl(icon),
            homeLink: contentNodeLink({ id }),
            followers: followersCount,
            resources: resourcesCount,
          }

          return props
        })
        .filter(isJust),
    [collectionEdges],
  )

  const followMut = useMutateEdge()
  const myFollowId = profile?.myFollow?.edges[0]?.edge.id
  const myProfile = session?.profile
  const me = useMemo(() => {
    return myProfile
      ? {
          toggleFollow() {
            if (!myProfile || isMyProfilePage || followMut.createResult.loading || followMut.deleteResult.loading) {
              return
            }
            const toggleFollowPromise = myFollowId
              ? followMut.deleteEdge({ edgeId: myFollowId })
              : followMut.createEdge<'Follows'>({ data: {}, edgeType: 'Follows', from: myProfile.id, to: id })
            toggleFollowPromise.then(() => nodeRes.refetch())
          },
          following: !!myFollowId,
        }
      : null
  }, [myProfile, myFollowId, isMyProfilePage, followMut, id, nodeRes])
  const props = useMemo<ProfilePageProps | null>(() => {
    return profile
      ? {
          resources,
          collections,
          summary: profile.summary,
          icon: getAssetRefUrl(profile.icon),
          followers: profile.followersCount,
          me,
          name: profile.name,
          pageHeaderProps,
        }
      : null
  }, [profile, resources, collections, me, pageHeaderProps])
  return props && <ProfilePage {...props} />
}
