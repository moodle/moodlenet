import { isEdgeNodeOfType, narrowEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { duration } from 'moment'
import { useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { useSeoContentId } from '../../../../context/Global/Seo'
import { useSession } from '../../../../context/Global/Session'
import { getJustAssetRefUrl, getMaybeAssetRefUrlOrDefaultImage } from '../../../../helpers/data'
import {
  categoriesOptions,
  getGrade,
  getIscedF,
  getLang,
  getLicense,
  getLicenseOptField,
  getOriginalCreationStringsByTimestamp,
  getOriginalCreationTimestampByStrings,
  getType,
  langOptions,
  licensesOptions,
  monthOptions,
  resGradeOptions,
  resTypeOptions,
  yearsOptions
} from '../../../../helpers/resource-relation-data-static-and-utils'
import { useLMS } from '../../../../lib/moodleLMS/useSendToMoodle'
import { href } from '../../../elements/link'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { useCreateResourceRelationMutation } from '../../NewResource/Ctrl/NewResourceCtrl.gen'
import { NewResourceFormValues } from '../../NewResource/types'
// import { useFormikBag } from '../../../lib/formik'
// import { NewResourceFormValues } from '../../NewResource/types'
import { ResourceProps } from '../Resource'
import {
  useDelResourceMutation,
  useDelResourceRelationMutation,
  useEditResourceMutation,
  useResourcePageDataQuery
} from './ResourcePage.gen'

export type ResourceCtrlProps = { id: ID }
export const useResourceCtrl: CtrlHook<ResourceProps, ResourceCtrlProps> = ({ id }) => {
  useSeoContentId(id)
  const { session, isAdmin, isAuthenticated } = useSession()
  const allMyOwnCollectionEdges = useMemo(
    () => session?.profile.myOwnCollections.edges.filter(isEdgeNodeOfType(['Collection'])) ?? [],
    [session?.profile.myOwnCollections.edges],
  )
  // console.log({ allMyOwnCollectionEdges })
  // const { org: localOrg } = useLocalInstance()
  const { data, refetch } = useResourcePageDataQuery({
    variables: {
      resourceId: id,
      myProfileId: session ? [session.profile.id] : [],
      myCollectionsIds: allMyOwnCollectionEdges.map(_ => _.node.id),
    },
  })
  const resourceData = narrowNodeType(['Resource'])(data?.node)
  const history = useHistory()
  const [delResource, delResourceRes] = useDelResourceMutation()
  const myId = session?.profile.id
  const deleteResource = useCallback(() => {
    if (!myId || delResourceRes.loading) {
      return
    }
    delResource({ variables: { node: { id, nodeType: 'Resource' } } }).then(() => {
      history.replace(nodeGqlId2UrlPath(myId))
    })
  }, [delResource, delResourceRes.loading, history, id, myId])

  const [addRelation, addRelationRes] = useCreateResourceRelationMutation()
  const [delRelation, delRelationRes] = useDelResourceRelationMutation()
  const [edit, editRes] = useEditResourceMutation()
  const categoryEdge = narrowEdgeNodeOfType(['IscedField'])(resourceData?.categories.edges[0])
  const levelEdge = narrowEdgeNodeOfType(['IscedGrade'])(resourceData?.grades.edges[0])
  const typeEdge = narrowEdgeNodeOfType(['ResourceType'])(resourceData?.types.edges[0])
  const languageEdge = narrowEdgeNodeOfType(['Language'])(resourceData?.languages.edges[0])
  const licenseEdge = narrowEdgeNodeOfType(['License'])(resourceData?.licenses.edges[0])

  const category = categoryEdge?.node.name ?? ''
  const level = levelEdge?.node.name ?? ''
  const type = typeEdge?.node.name ?? ''
  const language = languageEdge?.node.name ?? ''
  const license = getLicenseOptField(licenseEdge?.node.code ?? '')

  const [formik, formBag] = useFormikBag<NewResourceFormValues>({
    initialValues: {} as any,
    onSubmit: async vals => {
      if (!formik.dirty || !resourceData || addRelationRes.loading || delRelationRes.loading || editRes.loading) {
        return
      }
      const editResPr = edit({
        variables: {
          id,
          resInput: {
            description: vals.description,
            name: vals.title,
            originalCreationDate: getOriginalCreationTimestampByStrings({
              originalDateMonth: vals.originalDateMonth,
              originalDateYear: vals.originalDateYear,
            }),
          },
        },
      })
      const editLangRelPr = (() => {
        if (!vals.language || vals.language === language) {
          return
        }
        const { langId } = getLang(vals.language)
        return Promise.all([
          languageEdge && delRelation({ variables: { edge: { id: languageEdge.edge.id } } }),
          addRelation({
            variables: { edge: { edgeType: 'Features', from: id, to: langId, Features: {} } },
          }),
        ])
      })()

      const editLicenseRelPr = (() => {
        if (!vals.license || vals.license === license) {
          return
        }
        const { licenseId } = getLicense(vals.license)
        return Promise.all([
          licenseEdge && delRelation({ variables: { edge: { id: licenseEdge.edge.id } } }),
          addRelation({
            variables: { edge: { edgeType: 'Features', from: id, to: licenseId, Features: {} } },
          }),
        ])
      })()

      const editTypeRelPr = (() => {
        if (!vals.type || vals.type === type) {
          return
        }
        const { typeId } = getType(vals.type)
        return Promise.all([
          typeEdge && delRelation({ variables: { edge: { id: typeEdge.edge.id } } }),
          addRelation({
            variables: { edge: { edgeType: 'Features', from: id, to: typeId, Features: {} } },
          }),
        ])
      })()

      const editGradeRelPr = (() => {
        if (!vals.level || vals.level === level) {
          return
        }
        const { gradeId } = getGrade(vals.level)
        return Promise.all([
          levelEdge && delRelation({ variables: { edge: { id: levelEdge.edge.id } } }),
          addRelation({
            variables: { edge: { edgeType: 'Features', from: id, to: gradeId, Features: {} } },
          }),
        ])
      })()

      const editIscedFRelPr = (() => {
        if (!vals.category || vals.category === category) {
          return
        }
        const { iscedFId } = getIscedF(vals.category)
        return Promise.all([
          categoryEdge && delRelation({ variables: { edge: { id: categoryEdge.edge.id } } }),
          addRelation({
            variables: { edge: { edgeType: 'Features', from: id, to: iscedFId, Features: {} } },
          }),
        ])
      })()

      await Promise.all([editResPr, editLangRelPr, editLicenseRelPr, editTypeRelPr, editGradeRelPr, editIscedFRelPr])
      return refetch()
    },
  })
  const { resetForm: fresetForm } = formik

  useEffect(() => {
    if (resourceData) {
      const { name: title, description, image, content } = resourceData
      const orgDateStrings = getOriginalCreationStringsByTimestamp(resourceData.originalCreationDate)
      fresetForm({
        touched: {},
        values: {
          category,
          language,
          level,
          license,
          type,

          collections: allMyOwnCollectionEdges.map(edge => ({ label: edge.node.name, id: edge.node.id })),
          content: getJustAssetRefUrl(content),
          description,
          format: content.mimetype,
          image: getMaybeAssetRefUrlOrDefaultImage(image, id, 'image'),
          contentType: content.ext ? 'Link' : 'File',
          name: '',
          ...orgDateStrings,
          title,
        },
      })
    }
  }, [
    resourceData,
    fresetForm,
    category,
    language,
    level,
    license,
    type,
    id,
    session?.profile.myOwnCollections.edges,
    allMyOwnCollectionEdges,
  ])

  const creatorEdge = narrowEdgeNodeOfType(['Profile'])(resourceData?.creator.edges[0])

  const creator = creatorEdge?.node

  const isOwner = isAdmin || (creator && session ? creator.id === session.profile.id : false)

  const myBookmarkedEdgeId = resourceData?.myBookmarked.edges[0]?.edge.id
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

  const likedEdge = resourceData?.myLike.edges[0]
  const liked = !!likedEdge
  const toggleLike = useCallback(async () => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (likedEdge) {
      await delRelation({ variables: { edge: { id: likedEdge.edge.id } } })
    } else {
      await addRelation({
        variables: { edge: { edgeType: 'Likes', from: session.profile.id, to: id, Likes: {} } },
      })
    }
    refetch()
  }, [session, addRelationRes.loading, delRelationRes.loading, likedEdge, refetch, delRelation, addRelation, id])

  const { sendToLMS, currentLMSPrefs } = useLMS(
    licenseEdge && resourceData
      ? { asset: resourceData.content, resource: resourceData, license: licenseEdge.node }
      : null,
  )

  const sendToMoodleLms = useCallback((site?: string) => sendToLMS(site), [sendToLMS])
  const resourceProps = useMemo<null | ResourceProps>(() => {
    if (!resourceData) {
      return null
    }
    const props: ResourceProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, id),
      formBag,
      title: resourceData.name,
      isOwner,
      liked,
      contributorCardProps: {
        avatarUrl: getMaybeAssetRefUrlOrDefaultImage(creator?.avatar, creator?.id || id, 'icon'),
        creatorProfileHref: href(creator ? nodeGqlId2UrlPath(creator.id) : ''),
        displayName: creator?.name ?? '',
        timeSinceCreation: creatorEdge
          ? duration(creatorEdge.edge._created - new Date().valueOf(), 'milliseconds').humanize(true)
          : '?',
      },
      isAuthenticated,
      tags: resourceData.categories.edges.filter(isEdgeNodeOfType(['IscedField'])).map(({ node }) => ({
        name: node.name,
        type: 'General',
        subjectHomeHref: href(nodeGqlId2UrlPath(node.id)),
      })),
      collections: allMyOwnCollectionEdges.map(({ node: { id, name } }) => ({ label: name, id })),
      selectedCollections: resourceData.inMyCollections.edges
        .filter(isEdgeNodeOfType(['Collection']))
        .map(({ node: { name: label, id } }) => ({ label, id })),
      setAddToCollections: async selectedCollItems => {
        const selectedIds = selectedCollItems.map(({ id }) => id as string)
        const myCollectionsIds = allMyOwnCollectionEdges.map(({ node: { id } }) => id)
        const containedInCollEdges = resourceData.inMyCollections.edges.filter(isEdgeNodeOfType(['Collection']))

        const containedInCollIds = containedInCollEdges.map(({ node: { id } }) => id)
        const collIdsToAdd = selectedIds.filter(selectedId => !containedInCollIds.includes(selectedId))

        const collEdgesToRem = containedInCollEdges.filter(
          myColEdge => !selectedIds.includes(myColEdge.node.id) && myCollectionsIds.includes(myColEdge.node.id),
        )

        console.log('***', {
          add: collIdsToAdd.join(),
          rem: collEdgesToRem.map(({ node: { name } }) => name).join(),
          selected: selectedCollItems.map(({ label }) => label).join(),
        })
        //FIXME: enters once and makes 1 single promise array but does http calls twice ! :|
        const promises = [
          ...collIdsToAdd.map(collIdToAdd => {
            console.log(`**** addd`, collIdToAdd)

            return addRelation({
              variables: { edge: { edgeType: 'Features', from: collIdToAdd, to: id, Features: {} } },
            })
          }),
          ...collEdgesToRem.map(selectedCollEdgeToAdd => {
            console.log(`**** remmm`, selectedCollEdgeToAdd)
            return delRelation({
              variables: { edge: { id: selectedCollEdgeToAdd.edge.id } },
            })
          }),
        ]
        console.log('***', promises)
        const _ = await Promise.all<any>(promises)
        console.log('***', _)
        refetch()
      },
      languages: langOptions,
      levels: resGradeOptions,
      types: resTypeOptions,
      months: monthOptions,
      years: yearsOptions,
      categories: categoriesOptions,
      licenses: licensesOptions,
      updateResource: formik.submitForm,
      toggleLike,
      bookmarked: !!myBookmarkedEdgeId,
      numLikes: resourceData.likesCount,
      toggleBookmark,
      deleteResource,
      sendToMoodleLms,
      lmsSite: currentLMSPrefs?.site,
      contentUrl: getJustAssetRefUrl(resourceData.content),
      type: resourceData.content.ext ? 'link' : 'file',
    }
    return props
  }, [
    resourceData,
    id,
    formBag,
    isOwner,
    liked,
    creator,
    creatorEdge,
    isAuthenticated,
    allMyOwnCollectionEdges,
    formik.submitForm,
    toggleLike,
    myBookmarkedEdgeId,
    toggleBookmark,
    deleteResource,
    currentLMSPrefs,
    sendToMoodleLms,
    addRelation,
    delRelation,
    refetch,
  ])
  return resourceProps && [resourceProps]
}
