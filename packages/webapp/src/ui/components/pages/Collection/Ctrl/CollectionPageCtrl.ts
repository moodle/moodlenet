import { isEdgeNodeOfType, narrowEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { AssetRefInput } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
import { getMaybeAssetRefUrl, useUploadTempFile } from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useFormikBag } from '../../../../lib/formik'
import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewCollectionFormValues } from '../../NewCollection/types'
import { VisibilityDropdown } from '../../NewResource/FieldsData'
// import { useFormikBag } from '../../../lib/formik'
// import { NewCollectionFormValues } from '../../NewCollection/types'
import { CollectionProps } from '../Collection'
import {
  useAddCollectionRelationMutation,
  useCollectionPageDataQuery,
  useDelCollectionMutation,
  useDelCollectionRelationMutation,
  useEditCollectionMutation,
} from './CollectionPage.gen'

export type CollectionCtrlProps = { id: ID }
export const useCollectionCtrl: CtrlHook<CollectionProps, CollectionCtrlProps> = ({ id }) => {
  useSeoContentId(id)
  // const { org: localOrg } = useLocalInstance()
  const { session, isAdmin, isAuthenticated } = useSession()

  const { data, refetch } = useCollectionPageDataQuery({ variables: { collectionId: id } })
  const collectionData = narrowNodeType(['Collection'])(data?.node)
  const [addRelation, addRelationRes] = useAddCollectionRelationMutation()
  const [delRelation, delRelationRes] = useDelCollectionRelationMutation()
  const [edit, editRes] = useEditCollectionMutation()
  const categoryEdge = narrowEdgeNodeOfType(['IscedField'])(collectionData?.categories.edges[0])

  const history = useHistory()
  const [delCollection, delCollectionRes] = useDelCollectionMutation()
  const myId = session?.profile.id
  const deleteCollection = useCallback(() => {
    if (!myId || delCollectionRes.loading) {
      return
    }
    delCollection({ variables: { node: { id, nodeType: 'Collection' } } }).then(() => {
      history.replace(nodeGqlId2UrlPath(myId))
    })
  }, [delCollection, delCollectionRes.loading, history, id, myId])

  const myFollowEdgeId = collectionData?.myFollow.edges[0]?.edge.id
  const toggleFollow = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myFollowEdgeId) {
      return delRelation({ variables: { edge: { id: myFollowEdgeId } } }).then(() => refetch())
    } else {
      return addRelation({
        variables: { edge: { edgeType: 'Follows', from: session.profile.id, to: id, Follows: {} } },
      }).then(() => refetch())
    }
  }, [addRelation, addRelationRes.loading, delRelation, delRelationRes.loading, id, myFollowEdgeId, refetch, session])

  const myBookmarkedEdgeId = collectionData?.myBookmarked.edges[0]?.edge.id
  const toggleBookmark = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myBookmarkedEdgeId) {
      return delRelation({ variables: { edge: { id: myBookmarkedEdgeId } } }).then(() => refetch())
    } else {
      return addRelation({
        variables: { edge: { edgeType: 'Bookmarked', from: session.profile.id, to: id, Bookmarked: {} } },
      }).then(() => refetch())
    }
  }, [
    addRelation,
    addRelationRes.loading,
    delRelation,
    delRelationRes.loading,
    id,
    myBookmarkedEdgeId,
    refetch,
    session,
  ])

  const category = categoryEdge?.node.name ?? ''
  const uploadTempFile = useUploadTempFile()

  const [formik, formBag] = useFormikBag<NewCollectionFormValues>({
    initialValues: {} as any,
    onSubmit: async vals => {
      if (!formik.dirty || !collectionData || addRelationRes.loading || delRelationRes.loading || editRes.loading) {
        return
      }
      const imageAssetRef: AssetRefInput = !vals.image
        ? { location: '', type: 'NoChange' }
        : typeof vals.image === 'string'
        ? {
            location: vals.image,
            type: 'ExternalUrl',
          }
        : {
            location: await uploadTempFile('image', vals.image),
            type: 'TmpUpload',
          }
      await edit({
        variables: {
          id,
          collInput: {
            description: vals.description,
            name: vals.title,
            visibility: vals.visibility,
            image: imageAssetRef,
            _published: vals.visibility === 'Public',
          },
        },
      })

      return refetch()
    },
  })
  const { resetForm: fresetForm } = formik
  useEffect(() => {
    if (collectionData) {
      const { name: title, description, _published, image } = collectionData
      fresetForm({
        touched: {},
        values: {
          title,
          description,
          visibility: _published ? 'Public' : 'Private',
          image: getMaybeAssetRefUrl(image),
          imageUrl: getMaybeAssetRefUrl(image),
        },
      })
    }
  }, [collectionData, fresetForm, category, id])

  const formikSetFieldValue = formik.setFieldValue
  useEffect(() => {
    if (!(formik.values.image instanceof File)) {
      formikSetFieldValue('imageUrl', formik.values.image)
      return
    }
    const imageObjectUrl = URL.createObjectURL(formik.values.image)
    // console.log(`CreatTING`, imageObjectUrl)
    formikSetFieldValue('imageUrl', imageObjectUrl)
    return () => {
      // console.log(`reVOKING   `, imageObjectUrl)
      imageObjectUrl && URL.revokeObjectURL(imageObjectUrl)
    }
  }, [formikSetFieldValue, formik.values.image])

  // console.log(formik.values)

  const creatorEdge = narrowEdgeNodeOfType(['Profile'])(collectionData?.creator.edges[0])
  const creator = creatorEdge?.node

  const resourceEdges = useMemo(() => (collectionData?.resources.edges || []).filter(isEdgeNodeOfType(['Resource'])), [
    collectionData?.resources.edges,
  ])
  const isOwner = isAdmin || (creator && session ? creator.id === session.profile.id : false)

  const removeResource = useCallback(
    (edgeId: string) => {
      if (delRelationRes.loading) {
        return
      }
      return delRelation({ variables: { edge: { id: edgeId } } }).then(() => refetch())
    },
    [delRelation, delRelationRes.loading, refetch],
  )

  const collectionProps = useMemo<null | CollectionProps>(() => {
    if (!collectionData) {
      return null
    }
    const props: CollectionProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
      formBag,
      isOwner,
      isAuthenticated,
      visibility: VisibilityDropdown,
      resourceCardPropsList: resourceEdges.map(({ edge, node: { id } }) =>
        ctrlHook(
          useResourceCardCtrl,
          {
            id,
            removeAction: isOwner && (() => removeResource(edge.id)),
          },
          id,
        ),
      ),
      contributorCardProps: {
        avatarUrl: getMaybeAssetRefUrl(creator?.avatar),
        creatorProfileHref: href(creator ? nodeGqlId2UrlPath(creator.id) : ''),
        displayName: creator?.name ?? '',
      },
      updateCollection: formik.submitForm,
      bookmarked: !!myBookmarkedEdgeId,
      following: !!myFollowEdgeId,
      toggleBookmark,
      numFollowers: collectionData.followersCount,
      toggleFollow,
      deleteCollection: isOwner ? deleteCollection : undefined,
    }
    return props
  }, [
    collectionData,
    formBag,
    isOwner,
    isAuthenticated,
    resourceEdges,
    creator,
    formik.submitForm,
    myBookmarkedEdgeId,
    myFollowEdgeId,
    toggleBookmark,
    toggleFollow,
    deleteCollection,
    removeResource,
  ])
  return collectionProps && [collectionProps]
}
