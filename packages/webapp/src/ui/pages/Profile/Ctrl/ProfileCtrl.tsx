import { isJust } from '@moodlenet/common/lib/utils/array'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { getMaybeAssetRefUrl } from '../../../../helpers/data'
import {
  CollectionCardCtrlProps,
  collectionCardWithPropList,
} from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import {
  ResourceCardCtrlProps,
  resourceCardWithPropList,
} from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { createWithProps, CtrlProps } from '../../../lib/ctrl'
import { headerPageTemplateWithProps } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { ProfileProps } from '../Profile'
import { useProfilePageUserDataQuery } from './ProfileCtrl.gen'

export type ProfileCtrlProps = { id: Id }
export const [ProfileCtrl, profileWithProps] = createWithProps<ProfileProps, ProfileCtrlProps>(
  ({ __key, __uiComp: ProfileUI, id, ...rest }) => {
    const profileQ = useProfilePageUserDataQuery({ variables: { profileId: id } })

    const collectionCardPropsList = useMemo(
      () =>
        profileQ.data?.node?.collections.edges
          .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
          .filter(isJust)
          .map<CtrlProps<CollectionCardCtrlProps>>(({ id }) => ({ id, key: id })),
      [profileQ.data?.node?.collections.edges],
    )

    const resourceCardPropsList = useMemo(
      () =>
        profileQ.data?.node?.resources.edges
          .map(edge => (edge.node.__typename === 'Resource' ? edge.node : null))
          .filter(isJust)
          .map<CtrlProps<ResourceCardCtrlProps>>(({ id }) => ({ id, key: id })),
      [profileQ.data?.node?.resources.edges],
    )
    const profile = profileQ.data?.node?.__typename === 'Profile' ? profileQ.data?.node : null
    const profileProps = useMemo<ProfileProps | null>(
      () =>
        profile
          ? {
              headerPageTemplateWithProps: headerPageTemplateWithProps({ key: 'Profile - Header Page Template' }),
              resourceCardWithPropsList: resourceCardWithPropList(resourceCardPropsList || []),
              collectionCardWithPropsList: collectionCardWithPropList(collectionCardPropsList || []),
              overallCardProps: {
                followers: profile.followersCount,
                resources: profile.resourcesCount,
                years: 1,
              },
              profileCardProps: {
                avatarUrl: getMaybeAssetRefUrl(profile.icon) ?? 'https://picsum.photos/id/509/200/300',

                backgroundUrl: 'https://picsum.photos/id/501/600/400',
                description: profile.summary,
                firstName: profile.name,
                lastName: profile.name,
                location: 'Barcelona',
                organizationName: 'juanito.co',
                siteUrl: 'www.juanito.example',
                username: profile.name,
              },
              scoreCardProps: {
                kudos: 10,
                points: 20,
              },
              username: profile.name,
            }
          : null,
      [collectionCardPropsList, profile, resourceCardPropsList],
    )
    return profileProps && <ProfileUI {...profileProps} {...rest} key={__key} />
  },
)
