import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { useCallback, useMemo } from 'react'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useCollectionCardCtrl } from '../../../molecules/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
// import { useFormikBag } from '../../../lib/formik'
// import { NewCategoryFormValues } from '../../NewCategory/types'
import { CategoryProps } from '../Category'
import {
    useAddCategoryRelationMutation,
    useCategoryPageDataQuery,
    useDelCategoryRelationMutation
} from './CategoryPage.gen'

export type CategoryCtrlProps = { id: ID }
export const useCategoryCtrl: CtrlHook<CategoryProps, CategoryCtrlProps> = ({ id }) => {
  useSeoContentId(id)
  const { session, isAuthenticated } = useSession()
  const [addCategoryRelation, addCategoryRelationRes] = useAddCategoryRelationMutation()
  const [delCategoryRelation, delCategoryRelationRes] = useDelCategoryRelationMutation()
  const { data, refetch } = useCategoryPageDataQuery({
    variables: { categoryId: id, myProfileId: session ? [session.profile.id] : [] },
  })

  const categoryData = narrowNodeType(['IscedField'])(data?.node)
  const myFollowEdgeId = categoryData?.myFollow.edges[0]?.edge.id

  const toggleFollow = useCallback(() => {
    if (!session || addCategoryRelationRes.loading || delCategoryRelationRes.loading) {
      return
    }
    if (myFollowEdgeId) {
      return delCategoryRelation({ variables: { edge: { id: myFollowEdgeId } } }).then(() => refetch())
    } else {
      return addCategoryRelation({
        variables: { edge: { edgeType: 'Follows', from: session.profile.id, to: id, Follows: {} } },
      }).then(() => refetch())
    }
  }, [
    addCategoryRelation,
    addCategoryRelationRes.loading,
    delCategoryRelation,
    delCategoryRelationRes.loading,
    id,
    myFollowEdgeId,
    refetch,
    session,
  ])

  const categoryProps = useMemo<null | CategoryProps>(() => {
    if (!categoryData) {
      return null
    }

    const numFollowers = categoryData.followersCount
    const numCollections = categoryData.collectionsCount
    const numResources = categoryData.resourcesCount

    const following = !!myFollowEdgeId

    const collectionCardPropsList = categoryData.collections.edges
      .filter(isEdgeNodeOfType(['Collection']))
      .map(({ node: { id } }) => ctrlHook(useCollectionCardCtrl, { id }, id))

    const resourceCardPropsList = categoryData.resources.edges
      .filter(isEdgeNodeOfType(['Resource']))
      .map(({ node: { id } }) => ctrlHook(useResourceCardCtrl, { id, removeAction: false }, id))

    const props: CategoryProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
      title: categoryData.name,
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
  }, [categoryData, isAuthenticated, myFollowEdgeId, toggleFollow])
  return categoryProps && [categoryProps]
}
