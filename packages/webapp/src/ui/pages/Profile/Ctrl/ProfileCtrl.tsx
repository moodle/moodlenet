import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { getMaybeAssetRefUrl } from '../../../../helpers/data'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { ProfileProps } from '../Profile'
import { useProfilePageUserDataQuery } from './ProfileCtrl.gen'

export type ProfileCtrlProps = { id: ID }
export const useProfileCtrl: CtrlHook<ProfileProps, ProfileCtrlProps> = ({ id }) => {
  const { org: localOrg } = useLocalInstance()
  const profileQ = useProfilePageUserDataQuery({ variables: { profileId: id } })
  const profile = profileQ.data?.node?.__typename === 'Profile' ? profileQ.data.node : null
  const collections = useMemo(
    () =>
      (profile?.collections.edges || [])
        .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
        .filter(isJust),
    [profile?.collections.edges],
  )

  const resources = useMemo(
    () =>
      (profile?.resources.edges || [])
        .map(edge => (edge.node.__typename === 'Resource' ? edge.node : null))
        .filter(isJust),
    [profile?.resources.edges],
  )

  const profileProps = useMemo<ProfileProps | null>(() => {
    if (!profile) {
      return null
    }
    const kudos =
      resources.reduce((allLikes, { likesCount }) => allLikes + likesCount, 0) +
      collections.reduce((allLikes, { likesCount }) => allLikes + likesCount, 0)

    const props: ProfileProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      resourceCardPropsList: resources.map(({ id }) => ctrlHook(useResourceCardCtrl, { id })),
      collectionCardPropsList: collections.map(({ id }) => ctrlHook(useCollectionCardCtrl, { id })),
      overallCardProps: {
        followers: profile.followersCount,
        resources: profile.resourcesCount,
        years: 1,
        kudos,
      },
      profileCardProps: {
        avatarUrl:
          getMaybeAssetRefUrl(profile.avatar) ?? `https://picsum.photos/seed/${id.split('/')[1]}_avatar/200/300`,
        backgroundUrl:
          getMaybeAssetRefUrl(profile.image) ?? `https://picsum.photos/seed/${id.split('/')[1]}_bg/600/400`,
        description: profile.bio,
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        location: profile.location ?? '',
        organizationName: localOrg.name,
        siteUrl: profile.siteUrl ?? '',
        username: profile.name,
      },
      username: profile.name,
    }
    return props
  }, [collections, id, localOrg.name, profile, resources])
  return profileProps && [profileProps]
}
