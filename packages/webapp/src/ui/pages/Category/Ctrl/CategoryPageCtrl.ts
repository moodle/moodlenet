import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { useCallback, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
// import { useFormikBag } from '../../../lib/formik'
// import { NewCategoryFormValues } from '../../NewCategory/types'
import { CategoryProps } from '../Category'
import {
  useAddCategoryRelationMutation,
  useCategoryPageDataQuery,
  useDelCategoryRelationMutation,
} from './CategoryPage.gen'

export type CategoryCtrlProps = { id: ID }
export const useCategoryCtrl: CtrlHook<CategoryProps, CategoryCtrlProps> = ({ id }) => {
  const { session, isAuthenticated } = useSession()
  const [addCategoryRelation, addCategoryRelationRes] = useAddCategoryRelationMutation()
  const [delCategoryRelation, delCategoryRelationRes] = useDelCategoryRelationMutation()
  const { data, refetch } = useCategoryPageDataQuery({
    variables: { categoryId: id, myProfileId: session ? [session.profile.id] : [] },
  })

  const categoryData = data?.node?.__typename === 'IscedField' ? data.node : null
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
      .map(({ node }) => (node.__typename === 'Collection' ? node : null))
      .filter(isJust)
      .map(({ id }) => ctrlHook(useCollectionCardCtrl, { id }, id))

    const resourceCardPropsList = categoryData.resources.edges
      .map(({ node }) => (node.__typename === 'Resource' ? node : null))
      .filter(isJust)
      .map(({ id }) => ctrlHook(useResourceCardCtrl, { id }, id))

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
