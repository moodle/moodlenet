import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { getMaybeAssetRefUrl } from '../../../../helpers/data'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { ResourceProps } from '../Resource'
import { useResourcePageUserDataQuery } from './ResourceCtrl.gen'

export type ResourceCtrlProps = { id: ID }
export const useResourceCtrl: CtrlHook<ResourceProps, ResourceCtrlProps> = ({ id }) => {
  const { org: localOrg } = useLocalInstance()
  const ResourceQ = useResourcePageUserDataQuery({ variables: { ResourceId: id } })
  const Resource = ResourceQ.data?.node?.__typename === 'Resource' ? ResourceQ.data.node : null
  const collectionCardPropsList = useMemo(
    () =>
      (Resource?.collections.edges || [])
        .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
        .filter(isJust)
        .map(({ id }) => ctrlHook(useCollectionCardCtrl, { id })),
    [Resource?.collections.edges],
  )

  const resourceCardPropsList = useMemo(
    () =>
      (Resource?.resources.edges || [])
        .map(edge => (edge.node.__typename === 'Resource' ? edge.node : null))
        .filter(isJust)
        .map(({ id }) => ctrlHook(useResourceCardCtrl, { id })),
    [Resource?.resources.edges],
  )
  const ResourceProps = useMemo<ResourceProps | null>(
    () =>
      Resource
        ? {
            headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
            resourceCardPropsList,
            collectionCardPropsList,
            overallCardProps: {
              followers: Resource.followersCount,
              resources: Resource.resourcesCount,
              years: 1,
              kudos: 10,
            },
            ResourceCardProps: {
              avatarUrl:
                getMaybeAssetRefUrl(Resource.avatar) ?? `https://picsum.photos/seed/${id.split('/')[1]}_avatar/200/300`,
              backgroundUrl:
                getMaybeAssetRefUrl(Resource.image) ?? `https://picsum.photos/seed/${id.split('/')[1]}_bg/600/400`,
              description: Resource.bio,
              firstName: Resource.firstName ?? '',
              lastName: Resource.lastName ?? '',
              location: Resource.location ?? '',
              organizationName: localOrg.name,
              siteUrl: Resource.siteUrl ?? '',
              username: Resource.name,
            },
            username: Resource.name,
          }
        : null,
    [collectionCardPropsList, id, localOrg.name, Resource, resourceCardPropsList],
  )
  return ResourceProps && [ResourceProps]
}
