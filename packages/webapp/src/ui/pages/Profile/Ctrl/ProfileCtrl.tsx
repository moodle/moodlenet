import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../helpers/data'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { ProfileProps } from '../Profile'
import { useProfilePageUserDataQuery } from './ProfileCtrl.gen'

export type ProfileCtrlProps = { id: ID }
export const useProfileCtrl: CtrlHook<ProfileProps, ProfileCtrlProps> = ({ id }) => {
  const { org: localOrg } = useLocalInstance()
  const profile = narrowNodeType(['Profile'])(useProfilePageUserDataQuery({ variables: { profileId: id } }).data?.node)
  const collections = useMemo(
    () => (profile?.collections.edges || []).filter(isEdgeNodeOfType(['Collection'])).map(({ node }) => node),
    [profile?.collections.edges],
  )

  const resources = useMemo(
    () => (profile?.resources.edges || []).filter(isEdgeNodeOfType(['Resource'])).map(({ node }) => node),
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
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
      resourceCardPropsList: resources.map(({ id }) => ctrlHook(useResourceCardCtrl, { id }, id)),
      collectionCardPropsList: collections.map(({ id }) => ctrlHook(useCollectionCardCtrl, { id }, id)),
      overallCardProps: {
        followers: profile.followersCount,
        resources: profile.resourcesCount,
        years: 1,
        kudos,
      },
      profileCardProps: {
        avatarUrl: getMaybeAssetRefUrlOrDefaultImage(profile.avatar, id, 'icon'),
        backgroundUrl: getMaybeAssetRefUrlOrDefaultImage(profile.image, id, 'image'),
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
