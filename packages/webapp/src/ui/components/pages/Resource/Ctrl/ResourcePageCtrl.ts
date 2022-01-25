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
import { duration } from 'moment'
import { createElement, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
import {
  getJustAssetRefUrl,
  getMaybeAssetRefUrl,
  useUploadTempFile,
} from '../../../../../helpers/data'
import {
  getOriginalCreationTimestampByStrings,
  useIscedFields,
  useIscedGrades,
  useLanguages,
  useLicenses,
  useResourceTypes,
} from '../../../../../helpers/resource-relation-data-static-and-utils'
import { useLMS } from '../../../../../lib/moodleLMS/useSendToMoodle'
import { href } from '../../../../elements/link'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { fallbackProps } from '../../Extra/Fallback/Ctrl/FallbackCtrl'
import { Fallback } from '../../Extra/Fallback/Fallback'
import { useCreateResourceRelationMutation } from '../../NewResource/Ctrl/NewResourceCtrl.gen'
// import { useFormikBag } from '../../../lib/formik'
// import { NewResourceFormValues } from '../../NewResource/types'
import { ResourceFormValues, ResourceProps } from '../Resource'
import {
  useDelResourceMutation,
  useDelResourceRelationMutation,
  useEditResourceMutation,
  useResourcePageDataQuery,
} from './ResourcePage.gen'

export type ResourceCtrlProps = { id: ID }
export const useResourceCtrl: CtrlHook<ResourceProps, ResourceCtrlProps> = ({
  id,
}) => {
  useSeoContentId(id)
  const { session, isAdmin, isAuthenticated } = useSession()
  const allMyOwnCollectionEdges = useMemo(
    () =>
      session?.profile.myOwnCollections.edges.filter(
        isEdgeNodeOfType(['Collection'])
      ) ?? [],
    [session?.profile.myOwnCollections.edges]
  )
  // console.log({ allMyOwnCollectionEdges })
  // const { org: localOrg } = useLocalInstance()
  const { data, refetch, loading } = useResourcePageDataQuery({
    variables: {
      resourceId: id,
      myProfileId: session ? [session.profile.id] : [],
      myCollectionsIds: allMyOwnCollectionEdges.map((_) => _.node.id),
    },
    fetchPolicy: 'cache-and-network',
  })
  const resourceData = narrowNodeType(['Resource'])(data?.node)
  const history = useHistory()
  const [delResource, delResourceRes] = useDelResourceMutation()
  const myId = session?.profile.id
  const deleteResourceForm = useFormik({
    initialValues: {},
    async onSubmit() {
      if (!myId || delResourceRes.loading) {
        return
      }
      delResource({ variables: { node: { id, nodeType: 'Resource' } } }).then(
        () => {
          history.replace(nodeGqlId2UrlPath(myId))
        }
      )
    },
  })

  const [addRelation, addRelationRes] = useCreateResourceRelationMutation()
  const [delRelation, delRelationRes] = useDelResourceRelationMutation()
  const [edit, editRes] = useEditResourceMutation()
  const categoryEdge = narrowEdgeNodeOfType(['IscedField'])(
    resourceData?.categories.edges[0]
  )
  const levelEdge = resourceData?.grades.edges.filter(
    isEdgeNodeOfType(['IscedGrade'])
  )[0]

  const typeEdge = resourceData?.types.edges.filter(
    isEdgeNodeOfType(['ResourceType'])
  )[0]

  const languageEdge = resourceData?.languages.edges.filter(
    isEdgeNodeOfType(['Language'])
  )[0]

  const licenseEdge = resourceData?.licenses.edges.filter(
    isEdgeNodeOfType(['License'])
  )[0]

  const uploadTempFile = useUploadTempFile()
  const form = useFormik<ResourceFormValues>({
    initialValues: {} as any,
    onSubmit: async ({
      category,
      description,
      image,
      language,
      level,
      license,
      month,
      name,
      type,
      visibility,
      year,
    }) => {
      if (
        !form.dirty ||
        addRelationRes.loading ||
        delRelationRes.loading ||
        editRes.loading
      ) {
        return
      }
      const imageAssetRef: AssetRefInput =
        !image || image === form.initialValues.image
          ? { location: '', type: 'NoChange' }
          : typeof image === 'string'
          ? {
              location: image,
              type: 'ExternalUrl',
            }
          : {
              location: await uploadTempFile('image', image),
              type: 'TmpUpload',
            }
      const editResPr = edit({
        variables: {
          id,
          resInput: {
            description,
            name,
            originalCreationDate: getOriginalCreationTimestampByStrings({
              month,
              year,
            }),
            image: imageAssetRef,
            _published: visibility === 'Public',
          },
        },
      })
      const editLangRelPr = (() => {
        if (form.initialValues.language === language) {
          return
        }
        return Promise.all([
          languageEdge &&
            delRelation({ variables: { edge: { id: languageEdge.edge.id } } }),
          language &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: language,
                  Features: {},
                },
              },
            }),
        ])
      })()

      const editLicenseRelPr = (() => {
        if (form.initialValues.license === license) {
          return
        }
        return Promise.all([
          licenseEdge &&
            delRelation({ variables: { edge: { id: licenseEdge.edge.id } } }),
          license &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: license,
                  Features: {},
                },
              },
            }),
        ])
      })()

      const editTypeRelPr = (() => {
        if (form.initialValues.type === type) {
          return
        }
        return Promise.all([
          typeEdge &&
            delRelation({ variables: { edge: { id: typeEdge.edge.id } } }),
          type &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: type,
                  Features: {},
                },
              },
            }),
        ])
      })()

      const editGradeRelPr = (() => {
        if (form.initialValues.level === level) {
          return
        }
        return Promise.all([
          levelEdge &&
            delRelation({ variables: { edge: { id: levelEdge.edge.id } } }),
          level &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: level,
                  Features: {},
                },
              },
            }),
        ])
      })()

      const editIscedFRelPr = (() => {
        if (form.initialValues.category === category) {
          return
        }
        return Promise.all([
          categoryEdge &&
            delRelation({ variables: { edge: { id: categoryEdge.edge.id } } }),
          category &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: category,
                  Features: {},
                },
              },
            }),
        ])
      })()

      await Promise.all([
        editResPr,
        editLangRelPr,
        editLicenseRelPr,
        editTypeRelPr,
        editGradeRelPr,
        editIscedFRelPr,
      ])
      return refetch()
    },
  })

  const _resetform = form.resetForm
  useEffect(() => {
    if (resourceData) {
      const category = categoryEdge?.node.id!
      const level = levelEdge?.node.id
      const type = typeEdge?.node.id
      const language = languageEdge?.node.id
      const license = licenseEdge?.node.id
      const { name, description, image, _published } = resourceData
      const orgDate =
        typeof resourceData.originalCreationDate === 'number'
          ? new Date(resourceData.originalCreationDate)
          : null
      _resetform({
        touched: {},
        values: {
          category,
          language,
          level,
          license,
          type,
          description,
          image: getMaybeAssetRefUrl(image),
          name,
          visibility: _published ? 'Public' : 'Private',
          month: orgDate ? `${orgDate.getMonth()}` : undefined,
          year: orgDate ? `${orgDate.getFullYear()}` : undefined,
        },
      })
    }
  }, [
    _resetform,
    categoryEdge?.node.id,
    languageEdge?.node.id,
    levelEdge?.node.id,
    licenseEdge?.node.id,
    resourceData,
    typeEdge?.node.id,
  ])

  const creatorEdge = narrowEdgeNodeOfType(['Profile', 'Organization'])(
    resourceData?.creator.edges[0]
  )

  const creator = creatorEdge?.node

  const isOwner = creator && session ? creator.id === session.profile.id : false

  const myBookmarkedEdgeId = resourceData?.myBookmarked.edges[0]?.edge.id
  const toggleBookmarkForm = useFormik({
    initialValues: {},
    async onSubmit() {
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

  const likedEdge = resourceData?.myLike.edges[0]
  const liked = !!likedEdge
  const toggleLikeForm = useFormik({
    initialValues: {},
    async onSubmit() {
      if (!session || addRelationRes.loading || delRelationRes.loading) {
        return
      }
      if (likedEdge) {
        await delRelation({ variables: { edge: { id: likedEdge.edge.id } } })
      } else {
        await addRelation({
          variables: {
            edge: {
              edgeType: 'Likes',
              from: session.profile.id,
              to: id,
              Likes: {},
            },
          },
        })
      }
      refetch()
    },
  })

  const { sendToLMS, currentLMSPrefs } = useLMS(
    licenseEdge && resourceData
      ? {
          asset: resourceData.content,
          resource: resourceData,
          license: licenseEdge.node,
        }
      : null
  )

  const inMyCollectionsEdges = useMemo(
    () =>
      resourceData?.inMyCollections.edges.filter(
        isEdgeNodeOfType(['Collection'])
      ) ?? [],
    [resourceData?.inMyCollections.edges]
  )

  const addToCollectionsForm = useFormik<{ collections: string[] }>({
    initialValues: {
      collections: [],
    },
    onSubmit() {},
    async validate({ collections: curr }) {
      const prev = addToCollectionsForm.values.collections
      const toAdd = curr.filter((_) => !prev.includes(_))
      const toRemove = prev.filter((_) => !curr.includes(_))
      const toRemoveEdges = inMyCollectionsEdges.filter(({ node: { id } }) =>
        toRemove.includes(id)
      )
      const promises = [
        ...toAdd.map((toAddId) =>
          addRelation({
            variables: {
              edge: {
                edgeType: 'Features',
                from: toAddId,
                to: id,
                Features: {},
              },
            },
          })
        ),
        ...toRemoveEdges.map(({ edge: { id } }) =>
          delRelation({
            variables: { edge: { id } },
          })
        ),
      ]
      await Promise.all<any>(promises)
      refetch()
    },
  })
  const _resetAddToCollectionsForm = addToCollectionsForm.resetForm
  useEffect(() => {
    _resetAddToCollectionsForm({
      touched: {},
      values: {
        collections: inMyCollectionsEdges.map(({ node: { id } }) => id),
      },
    })
  }, [_resetAddToCollectionsForm, inMyCollectionsEdges])

  const sendToMoodleLmsForm = useFormik<{ site?: string }>({
    initialValues: { site: currentLMSPrefs?.site },
    onSubmit: async ({ site }, { setErrors }) => {
      const r = await sendToLMS(site)
      if (!r) {
        setErrors({ site: t`Couldn't send to your MoodleLMS` })
      }
    },
  })

  const languagesNodes = useLanguages()
  const levelsNodes = useIscedGrades()
  const typesNodes = useResourceTypes()
  const categoriesNodes = useIscedFields()
  const licensesNodes = useLicenses()

  const resourceProps = useMemo<null | ResourceProps>(() => {
    if (!resourceData) {
      return null
    }
    const props: ResourceProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, id),
      form,
      isOwner,
      isAdmin,
      liked,
      contributorCardProps: {
        avatarUrl: getMaybeAssetRefUrl(
          creator?.__typename === 'Profile'
            ? creator.avatar
            : creator?.smallLogo
        ),
        creatorProfileHref: href(creator ? nodeGqlId2UrlPath(creator.id) : ''),
        displayName: creator?.name ?? '',
        timeSinceCreation: creatorEdge
          ? duration(
              creatorEdge.edge._created - new Date().valueOf(),
              'milliseconds'
            ).humanize(true)
          : '?',
      },
      isAuthenticated,
      tags: resourceData.categories.edges
        .filter(isEdgeNodeOfType(['IscedField']))
        .map(({ node }) => ({
          name: node.name,
          type: 'subject',
          subjectHomeHref: href(nodeGqlId2UrlPath(node.id)),
        })),
      collections: {
        opts: allMyOwnCollectionEdges.map(({ node: { id, name } }) => ({
          value: id,
          label: name,
        })),
        selected: resourceData.inMyCollections.edges
          .filter(isEdgeNodeOfType(['Collection']))
          .map(({ node: { name: label, id: value } }) => ({ label, value })),
      },
      languages: {
        opts: languagesNodes.map(({ name, id }) => ({
          value: id,
          label: name,
        })),
        selected: languagesNodes
          .filter((node) => node.id === form.values.language)
          .map(({ name, id }) => ({ value: id, label: name }))[0],
      },
      levels: {
        opts: levelsNodes.map(({ name, id }) => ({ value: id, label: name })),
        selected: levelsNodes
          .filter((node) => node.id === form.values.level)
          .map(({ name, id }) => ({ value: id, label: name }))[0],
      },
      types: {
        opts: typesNodes.map(({ name, id }) => ({ value: id, label: name })),
        selected: typesNodes
          .filter((node) => node.id === form.values.type)
          .map(({ name, id }) => ({ value: id, label: name }))[0],
      },
      categories: {
        opts: categoriesNodes.map(({ name, id }) => ({
          value: id,
          label: name,
        })),
        selected: categoriesNodes
          .filter((node) => node.id === form.values.category)
          .map(({ name, id }) => ({ value: id, label: name }))[0],
      },
      licenses: {
        opts: licensesNodes.map(([{ name, id }, icon]) => ({
          value: id,
          label: name,
          icon,
        })),
        selected: licensesNodes
          .filter(([node]) => node.id === form.values.license)
          .map(([{ name, id }, icon]) => ({ value: id, label: name, icon }))[0],
      },
      toggleLikeForm: toggleLikeForm,
      bookmarked: !!myBookmarkedEdgeId,
      numLikes: resourceData.likesCount,
      toggleBookmarkForm: toggleBookmarkForm,
      deleteResourceForm: isOwner || isAdmin ? deleteResourceForm : undefined,
      sendToMoodleLmsForm: sendToMoodleLmsForm,
      contentUrl: getJustAssetRefUrl(resourceData.content),
      addToCollectionsForm,
      contentType: resourceData.content.ext ? 'link' : 'file',
      resourceFormat: resourceData.content.mimetype,
    }
    return props
  }, [
    resourceData,
    id,
    form,
    isOwner,
    isAdmin,
    liked,
    creator,
    creatorEdge,
    isAuthenticated,
    allMyOwnCollectionEdges,
    languagesNodes,
    levelsNodes,
    typesNodes,
    categoriesNodes,
    licensesNodes,
    toggleLikeForm,
    myBookmarkedEdgeId,
    toggleBookmarkForm,
    deleteResourceForm,
    sendToMoodleLmsForm,
    addToCollectionsForm,
  ])
  if (!loading && !data?.node) {
    return createElement(Fallback, fallbackProps({ key: 'resource-not-found' }))
  }
  return resourceProps && [resourceProps]
}
