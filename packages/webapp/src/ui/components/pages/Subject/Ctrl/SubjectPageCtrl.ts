import {
  isEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { createElement, useCallback, useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
import { getJustAssetRefUrl } from '../../../../../helpers/data'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useCollectionCardCtrl } from '../../../molecules/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { fallbackProps } from '../../Extra/Fallback/Ctrl/FallbackCtrl'
import { Fallback } from '../../Extra/Fallback/Fallback'
// import { useFormikBag } from '../../../lib/formik'
// import { NewSubjectFormValues } from '../../NewSubject/types'
import { SubjectProps } from '../Subject'
import {
  useAddSubjectRelationMutation,
  useDelSubjectRelationMutation,
  useSubjectPageDataQuery,
} from './SubjectPage.gen'

export type SubjectCtrlProps = { id: ID }
export const useSubjectCtrl: CtrlHook<SubjectProps, SubjectCtrlProps> = ({
  id,
}) => {
  useSeoContentId(id)
  const { session, isAuthenticated } = useSession()
  const [addSubjectRelation, addSubjectRelationRes] =
    useAddSubjectRelationMutation()
  const [delSubjectRelation, delSubjectRelationRes] =
    useDelSubjectRelationMutation()
  const { data, refetch, loading } = useSubjectPageDataQuery({
    variables: {
      categoryId: id,
      myProfileId: session ? [session.profile.id] : [],
    },
    fetchPolicy: 'cache-and-network',
  })

  const categoryData = narrowNodeType(['IscedField'])(data?.node)
  const myFollowEdgeId = categoryData?.myFollow.edges[0]?.edge.id

  const toggleFollow = useCallback(() => {
    if (
      !session ||
      addSubjectRelationRes.loading ||
      delSubjectRelationRes.loading
    ) {
      return
    }
    if (myFollowEdgeId) {
      return delSubjectRelation({
        variables: { edge: { id: myFollowEdgeId } },
      }).then(() => refetch())
    } else {
      return addSubjectRelation({
        variables: {
          edge: {
            edgeType: 'Follows',
            from: session.profile.id,
            to: id,
            Follows: {},
          },
        },
      }).then(() => refetch())
    }
  }, [
    addSubjectRelation,
    addSubjectRelationRes.loading,
    delSubjectRelation,
    delSubjectRelationRes.loading,
    id,
    myFollowEdgeId,
    refetch,
    session,
  ])

  const { org: localOrg } = useLocalInstance()

  const categoryProps = useMemo<null | SubjectProps>(() => {
    if (!categoryData) {
      return null
    }

    const numFollowers = categoryData.followersCount
    const numCollections = categoryData.collectionsCount
    const numResources = categoryData.resourcesCount

    const isFollowing = !!myFollowEdgeId

    const collectionCardPropsList = categoryData.collections.edges
      .filter(isEdgeNodeOfType(['Collection']))
      .map(({ node: { id } }) => ctrlHook(useCollectionCardCtrl, { id }, id))

    const resourceCardPropsList = categoryData.resources.edges
      .filter(isEdgeNodeOfType(['Resource']))
      .map(({ node: { id } }) =>
        ctrlHook(useResourceCardCtrl, { id, removeAction: false }, id)
      )

    const props: SubjectProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),
      organization: {
        name: localOrg.name,
        smallLogo: getJustAssetRefUrl(localOrg.smallLogo),
      },
      title: categoryData.name,
      collectionCardPropsList,
      isFollowing,
      isAuthenticated,
      numCollections,
      numFollowers,
      numResources,
      resourceCardPropsList,
      toggleFollow,
      isIscedSubject: true,
      iscedLink:
        'http://uis.unesco.org/en/topic/international-standard-classification-education-isced',
    }
    return props
  }, [
    categoryData,
    isAuthenticated,
    myFollowEdgeId,
    localOrg.name,
    localOrg.smallLogo,
    toggleFollow,
  ])
  if (!loading && !data?.node) {
    return createElement(Fallback, fallbackProps({ key: 'category-not-found' }))
  }

  return categoryProps && [categoryProps]
}
