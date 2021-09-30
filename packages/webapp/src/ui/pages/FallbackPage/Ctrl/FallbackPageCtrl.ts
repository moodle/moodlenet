import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { useCallback, useMemo } from 'react'
import { useSeoContentId } from '../../../../context/Global/Seo'
import { useSession } from '../../../../context/Global/Session'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
// import { useFormikBag } from '../../../lib/formik'
// import { NewFallbackPageFormValues } from '../../NewFallbackPage/types'
import { FallbackPageProps } from '../FallbackPage'
import {
  useAddFallbackPageRelationMutation,

  useDelFallbackPageRelationMutation, useFallbackPagePageDataQuery
} from './FallbackPage.gen'

export type FallbackPageCtrlProps = { id: ID }
export const useFallbackPageCtrl: CtrlHook<FallbackPageProps, FallbackPageCtrlProps> = ({ id }) => {
  useSeoContentId(id)
  const { session, isAuthenticated } = useSession()
  const [addFallbackPageRelation, addFallbackPageRelationRes] = useAddFallbackPageRelationMutation()
  const [delFallbackPageRelation, delFallbackPageRelationRes] = useDelFallbackPageRelationMutation()
  const { data, refetch } = useFallbackPagePageDataQuery({
    variables: { FallbackPageId: id, myProfileId: session ? [session.profile.id] : [] },
  })

  const FallbackPageData = narrowNodeType(['IscedField'])(data?.node)
  const myFollowEdgeId = FallbackPageData?.myFollow.edges[0]?.edge.id

  const toggleFollow = useCallback(() => {
    if (!session || addFallbackPageRelationRes.loading || delFallbackPageRelationRes.loading) {
      return
    }
    if (myFollowEdgeId) {
      return delFallbackPageRelation({ variables: { edge: { id: myFollowEdgeId } } }).then(() => refetch())
    } else {
      return addFallbackPageRelation({
        variables: { edge: { edgeType: 'Follows', from: session.profile.id, to: id, Follows: {} } },
      }).then(() => refetch())
    }
  }, [
    addFallbackPageRelation,
    addFallbackPageRelationRes.loading,
    delFallbackPageRelation,
    delFallbackPageRelationRes.loading,
    id,
    myFollowEdgeId,
    refetch,
    session,
  ])

  const FallbackPageProps = useMemo<null | FallbackPageProps>(() => {
    if (!FallbackPageData) {
      return null
    }

    const numFollowers = FallbackPageData.followersCount
    const numCollections = FallbackPageData.collectionsCount
    const numResources = FallbackPageData.resourcesCount

    const following = !!myFollowEdgeId

    const collectionCardPropsList = FallbackPageData.collections.edges
      .filter(isEdgeNodeOfType(['Collection']))
      .map(({ node: { id } }) => ctrlHook(useCollectionCardCtrl, { id }, id))

    const resourceCardPropsList = FallbackPageData.resources.edges
      .filter(isEdgeNodeOfType(['Resource']))
      .map(({ node: { id } }) => ctrlHook(useResourceCardCtrl, { id, removeAction: false }, id))

    const props: FallbackPageProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
      title: FallbackPageData.name,
      collectionCardPropsList,
      following,
      isAuthenticated,
      numCollections,
      numFollowers,
      numResources,
      resourceCardPropsList,
      toggleFollow,
    }
    return props
  }, [FallbackPageData, isAuthenticated, myFollowEdgeId, toggleFollow])
  return FallbackPageProps && [FallbackPageProps]
}
