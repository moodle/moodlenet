import { isEdgeNodeOfType, narrowEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../helpers/data'
import { categoriesOptions, getIscedF } from '../../../../helpers/resource-relation-data-static-and-utils'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { href } from '../../../elements/link'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { useCreateCollectionRelationMutation } from '../../NewCollection/Ctrl/NewCollectionCtrl.gen'
import { NewCollectionFormValues } from '../../NewCollection/types'
// import { useFormikBag } from '../../../lib/formik'
// import { NewCollectionFormValues } from '../../NewCollection/types'
import { CollectionProps } from '../Collection'
import {
  useCollectionPageDataQuery,
  useDelCollectionRelationMutation,
  useEditCollectionMutation,
} from './CollectionPage.gen'

export type CollectionCtrlProps = { id: ID }
export const useCollectionCtrl: CtrlHook<CollectionProps, CollectionCtrlProps> = ({ id }) => {
  // const { org: localOrg } = useLocalInstance()
  const { data, refetch } = useCollectionPageDataQuery({ variables: { collectionId: id } })
  const collectionData = narrowNodeType(['Collection'])(data?.node)
  const [createCollectionRelMut /* , createCollectionRelMutRes */] = useCreateCollectionRelationMutation()
  const [delCollectionRelMut /* , delCollectionRelMutRes */] = useDelCollectionRelationMutation()
  const [edit /* , editResult */] = useEditCollectionMutation()
  const categoryEdge = narrowEdgeNodeOfType(['IscedField'])(collectionData?.categories.edges[0])

  const category = categoryEdge?.node.name ?? ''

  const [formik, formBag] = useFormikBag<NewCollectionFormValues>({
    initialValues: {} as any,
    onSubmit: async vals => {
      console.log('save update', vals)
      if (!collectionData) {
        return
      }
      const editResPr = edit({
        variables: {
          id,
          collInput: {
            description: vals.description,
            name: vals.title,
          },
        },
      })

      const editIscedFRelPr = (() => {
        if (!vals.category || vals.category === category) {
          return
        }
        const { iscedFId } = getIscedF(vals.category)
        return Promise.all([
          categoryEdge && delCollectionRelMut({ variables: { edge: { id: categoryEdge.edge.id } } }),
          createCollectionRelMut({
            variables: { edge: { edgeType: 'Features', from: id, to: iscedFId, Features: {} } },
          }),
        ])
      })()

      await Promise.all([editResPr, editIscedFRelPr])
      return refetch()
    },
  })
  const { resetForm: fresetForm } = formik
  useEffect(() => {
    if (collectionData) {
      const { name: title, description, image } = collectionData
      fresetForm({
        touched: {},
        values: {
          title,
          description,
          category,
          image: getMaybeAssetRefUrlOrDefaultImage(image, id, 'image'),
        },
      })
    }
  }, [collectionData, fresetForm, category, id])

  const creatorEdge = narrowEdgeNodeOfType(['Profile'])(collectionData?.creator.edges[0])
  const creator = creatorEdge?.node

  const { session, isAdmin, isAuthenticated } = useSession()
  const resourceNodes = useMemo(
    () => (collectionData?.resources.edges || []).filter(isEdgeNodeOfType(['Resource'])).map(({ node }) => node),
    [collectionData?.resources.edges],
  )
  const isOwner = isAdmin || (creator && session ? creator.id === session.profile.id : false)
  const following = false
  const followers = 0
  const kudos = 0
  const collectionProps = useMemo<null | CollectionProps>(() => {
    if (!collectionData) {
      return null
    }
    const props: CollectionProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
      formBag,
      isOwner,
      following,
      isAuthenticated,
      resourceCardPropsList: resourceNodes.map(({ id }) => ctrlHook(useResourceCardCtrl, { id }, id)),
      overallCardProps: {
        followers,
        kudos,
        resources: collectionData.resourcesCount,
        years: creatorEdge ? new Date(creatorEdge.edge._created).getFullYear() : '?',
      },
      contributorCardProps: {
        avatarUrl: getMaybeAssetRefUrlOrDefaultImage(creator?.avatar, creator?.id || id, 'icon'),
        creatorProfileHref: href(creator ? nodeGqlId2UrlPath(creator.id) : ''),
        displayName: creator?.name ?? '',
      },
      categories: categoriesOptions,
      updateCollection: formik.submitForm,
    }
    return props
  }, [
    id,
    collectionData,
    formBag,
    isOwner,
    following,
    isAuthenticated,
    resourceNodes,
    creatorEdge,
    creator,
    formik.submitForm,
  ])
  return collectionProps && [collectionProps]
}
