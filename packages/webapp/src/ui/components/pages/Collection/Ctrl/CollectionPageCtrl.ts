import { t } from '@lingui/macro'
import {
  isEdgeNodeOfType,
  narrowEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useFormik } from 'formik'
import { createElement, useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { mixed, object, SchemaOf, string } from 'yup'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
import {
  getMaybeAssetRefUrl,
  useUploadTempFile,
} from '../../../../../helpers/data'
import { href } from '../../../../elements/link'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { fallbackProps } from '../../Extra/Fallback/Ctrl/FallbackCtrl'
import { Fallback } from '../../Extra/Fallback/Fallback'
import { NewCollectionFormValues } from '../../NewCollection/types'
import { CollectionProps } from '../Collection'
import {
  useAddCollectionRelationMutation,
  useCollectionPageDataQuery,
  useDelCollectionMutation,
  useDelCollectionRelationMutation,
  useEditCollectionMutation,
} from './CollectionPage.gen'

export const validationSchema: SchemaOf<NewCollectionFormValues> = object({
  description: string().required(t`Please provide a Description`),
  title: string().required(t`Please provide a title`),
  image: mixed().optional(),
  visibility: mixed().required(t`Visibility is required`),
})

export type CollectionCtrlProps = { id: ID }
export const useCollectionCtrl: CtrlHook<
  CollectionProps,
  CollectionCtrlProps
> = ({ id }) => {
  useSeoContentId(id)
  // const { org: localOrg } = useLocalInstance()
  const { session, isAdmin, isAuthenticated } = useSession()

  const { data, refetch, loading } = useCollectionPageDataQuery({
    variables: {
      collectionId: id,
      myProfileId: session ? [session.profile.id] : [],
    },
    fetchPolicy: 'cache-and-network',
  })
  const collectionData = narrowNodeType(['Collection'])(data?.node)
  const [addRelation, addRelationRes] = useAddCollectionRelationMutation()
  const [delRelation, delRelationRes] = useDelCollectionRelationMutation()
  const [edit, editRes] = useEditCollectionMutation()

  const history = useHistory()
  const [delCollection, delCollectionRes] = useDelCollectionMutation()
  const myId = session?.profile.id
  const deleteCollection = useFormik({
    initialValues: {},
    onSubmit: () => {
      if (!myId || delCollectionRes.loading) {
        return
      }
      delCollection({
        variables: { node: { id, nodeType: 'Collection' } },
      }).then(() => {
        history.replace(nodeGqlId2UrlPath(myId))
      })
    },
  })

  const myFollowEdgeId = collectionData?.myFollow.edges[0]?.edge.id
  const toggleFollow = useFormik({
    initialValues: {},
    onSubmit: () => {
      if (!session || addRelationRes.loading || delRelationRes.loading) {
        return
      }
      if (myFollowEdgeId) {
        return delRelation({
          variables: { edge: { id: myFollowEdgeId } },
        }).then(() => refetch())
      } else {
        return addRelation({
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
    },
  })

  const myBookmarkedEdgeId = collectionData?.myBookmarked.edges[0]?.edge.id
  const toggleBookmark = useFormik({
    initialValues: {},
    onSubmit: () => {
      if (!session || addRelationRes.loading || delRelationRes.loading) {
        return
      }
      if (myBookmarkedEdgeId) {
        return delRelation({
          variables: { edge: { id: myBookmarkedEdgeId } },
        }).then(() => refetch())
      } else {
        return addRelation({
          variables: {
            edge: {
              edgeType: 'Bookmarked',
              from: session.profile.id,
              to: id,
              Bookmarked: {},
            },
          },
        }).then(() => refetch())
      }
    },
  })

  const uploadTempFile = useUploadTempFile()

  const form = useFormik<NewCollectionFormValues>({
    initialValues: { description: '', title: '', visibility: 'Private' },
    onSubmit: async (vals) => {
      if (
        !form.dirty ||
        !collectionData ||
        addRelationRes.loading ||
        delRelationRes.loading ||
        editRes.loading
      ) {
        return
      }
      const imageAssetRef: AssetRefInput =
        !vals.image || vals.image === form.initialValues.image
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
            image: imageAssetRef,
            _published: vals.visibility === 'Public',
          },
        },
      })

      return refetch()
    },
  })
  const { resetForm: _resetForm } = form
  useEffect(() => {
    if (collectionData) {
      const { name: title, description, _published, image } = collectionData
      _resetForm({
        touched: {},
        values: {
          title,
          description,
          visibility: _published ? 'Public' : 'Private',
          image: getMaybeAssetRefUrl(image),
        },
      })
    }
  }, [collectionData, _resetForm, id])

  const formikSetFieldValue = form.setFieldValue
  useEffect(() => {
    if (!(form.values.image instanceof File)) {
      formikSetFieldValue('imageUrl', form.values.image)
      return
    }
    const imageObjectUrl = URL.createObjectURL(form.values.image)
    // console.log(`CreatTING`, imageObjectUrl)
    formikSetFieldValue('imageUrl', imageObjectUrl)
    return () => {
      // console.log(`reVOKING   `, imageObjectUrl)
      imageObjectUrl && URL.revokeObjectURL(imageObjectUrl)
    }
  }, [formikSetFieldValue, form.values.image])

  // console.log(formik.values)

  const creatorEdge = narrowEdgeNodeOfType(['Profile', 'Organization'])(
    collectionData?.creator.edges[0]
  )
  const creator = creatorEdge?.node

  const resourceEdges = useMemo(
    () =>
      (collectionData?.resources.edges || []).filter(
        isEdgeNodeOfType(['Resource'])
      ),
    [collectionData?.resources.edges]
  )
  const isOwner = creator && session ? creator.id === session.profile.id : false

  const removeResource = useCallback(
    (edgeId: string) => {
      if (delRelationRes.loading) {
        return
      }
      return delRelation({ variables: { edge: { id: edgeId } } }).then(() =>
        refetch()
      )
    },
    [delRelation, delRelationRes.loading, refetch]
  )

  const collectionProps = useMemo<null | CollectionProps>(() => {
    if (!collectionData) {
      return null
    }
    const props: CollectionProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),
      form,
      isOwner,
      isAdmin,
      isAuthenticated,
      resourceCardPropsList: resourceEdges.map(({ edge, node: { id } }) =>
        ctrlHook(
          useResourceCardCtrl,
          {
            id,
            removeAction: isOwner && (() => removeResource(edge.id)),
          },
          id
        )
      ),
      contributorCardProps: {
        avatarUrl: getMaybeAssetRefUrl(
          creator?.__typename === 'Profile'
            ? creator.avatar
            : creator?.smallLogo
        ),
        creatorProfileHref: href(creator ? nodeGqlId2UrlPath(creator.id) : ''),
        displayName: creator?.name ?? '',
      },
      bookmarked: !!myBookmarkedEdgeId,
      following: !!myFollowEdgeId,
      toggleBookmark,
      numFollowers: collectionData.followersCount,
      toggleFollow,
      deleteCollection: isOwner || isAdmin ? deleteCollection : undefined,
    }
    return props
  }, [
    collectionData,
    form,
    isOwner,
    isAuthenticated,
    resourceEdges,
    creator,
    myBookmarkedEdgeId,
    myFollowEdgeId,
    toggleBookmark,
    toggleFollow,
    deleteCollection,
    removeResource,
    isAdmin,
  ])
  if (!loading && !data?.node) {
    return createElement(
      Fallback,
      fallbackProps({ key: 'collection-not-found' })
    )
  }

  return collectionProps && [collectionProps]
}
