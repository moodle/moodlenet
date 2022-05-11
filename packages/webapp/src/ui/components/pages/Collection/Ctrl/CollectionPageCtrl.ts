import { t } from '@lingui/macro'
import {
  isEdgeNodeOfType,
  narrowEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { fileExceedsMaxUploadSize } from '@moodlenet/common/dist/staticAsset/lib'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useFormik } from 'formik'
import { createElement, useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { mixed, object, SchemaOf, string } from 'yup'
import { MNEnv, UNSPLASH_ENDPOINT } from '../../../../../constants'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
import {
  fullLocalEntityUrlByGqlId,
  getMaybeAssetRefUrl,
  useUploadTempFile,
} from '../../../../../helpers/data'
import { useAutoImageAdded } from '../../../../../helpers/utilities'
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
  description: string()
    .max(4096)
    .min(3)
    .required(t`Please provide a description`),
  title: string()
    .min(3)
    .max(160)
    .required(t`Please provide a title`),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, MNEnv.maxUploadSize)
        ? createError({
            message: t`The image is too big, reduce the size or use another image`,
          })
        : true
    )
    .optional(),
  visibility: mixed().required(t`Visibility is required`),
})

export type CollectionCtrlProps = { id: ID }
export const useCollectionCtrl: CtrlHook<
  CollectionProps,
  CollectionCtrlProps
> = ({ id }) => {
  useSeoContentId(id)
  // const { org: localOrg } = useLocalInstance()
  const { reportEntity, session, isAdmin, isAuthenticated } = useSession()
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
  const autoImageAdded = useAutoImageAdded().get()
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
    initialValues: { description: '', title: '', visibility: undefined as any },
    validationSchema,
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
      // debugger
      const imageAssetRef: AssetRefInput = !vals.image
        ? {
            location: '',
            type: 'NoAsset',
            credits: form.initialValues.image?.credits,
          }
        : vals.image.location === form.initialValues.image?.location
        ? {
            location: '',
            type: 'NoChange',
          }
        : typeof vals.image.location === 'string'
        ? {
            location: vals.image.location,
            type: 'ExternalUrl',
            credits: vals.image.credits,
          }
        : vals.image.location instanceof File
        ? {
            location: await uploadTempFile('image', vals.image.location),
            type: 'TmpUpload',
            credits: vals.image.credits,
          }
        : {
            location: '',
            type: 'NoChange',
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
  const _resetForm = form.resetForm
  useEffect(() => {
    if (collectionData) {
      const { name: title, description, _published, image } = collectionData
      const _image = image ? getMaybeAssetRefUrl(image) : undefined
      _resetForm({
        touched: {},
        values: {
          title,
          description,
          visibility: _published ? 'Public' : 'Private',
          image: _image
            ? { location: _image, credits: image?.credits }
            : undefined,
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
  const collectionUrl = fullLocalEntityUrlByGqlId(id)

  const reportForm = useFormik({
    initialValues: { comment: '' },
    validationSchema: object({ comment: string().required() }),
    validateOnMount: true,
    onSubmit: async ({ comment }) => {
      await reportEntity({
        comment,
        entityUrl: collectionUrl,
      })
    },
  })
  const collectionProps = useMemo<null | CollectionProps>(() => {
    if (!collectionData) {
      return null
    }
    const props: CollectionProps = {
      collectionUrl,
      reportForm,
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),
      canSearchImage: !!UNSPLASH_ENDPOINT,
      collectionId: collectionData.id,
      form,
      isOwner,
      isAdmin,
      isAuthenticated,
      autoImageAdded,
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
      isFollowing: !!myFollowEdgeId,
      toggleBookmark,
      numFollowers: collectionData.followersCount,
      toggleFollow,
      deleteCollection: isOwner || isAdmin ? deleteCollection : undefined,
    }
    return props
  }, [
    collectionData,
    collectionUrl,
    reportForm,
    form,
    isOwner,
    isAdmin,
    isAuthenticated,
    autoImageAdded,
    resourceEdges,
    creator,
    myBookmarkedEdgeId,
    myFollowEdgeId,
    toggleBookmark,
    toggleFollow,
    deleteCollection,
    removeResource,
  ])
  if (!loading && !data?.node) {
    return createElement(
      Fallback,
      fallbackProps({ key: 'collection-not-found' })
    )
  }

  return collectionProps && [collectionProps]
}
