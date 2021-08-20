import { isEdgeNodeOfType, narrowEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { duration } from 'moment'
import { useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
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
  yearsOptions,
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
  useResourcePageDataQuery,
} from './ResourcePage.gen'

export type ResourceCtrlProps = { id: ID }
export const useResourceCtrl: CtrlHook<ResourceProps, ResourceCtrlProps> = ({ id }) => {
  const { session, isAdmin, isAuthenticated } = useSession()
  // const { org: localOrg } = useLocalInstance()
  const { data, refetch } = useResourcePageDataQuery({
    variables: { resourceId: id, myProfileId: session ? [session.profile.id] : [] },
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

          addToCollections: [],
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
  }, [resourceData, fresetForm, category, language, level, license, type, id])

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

  const sendToMoodleLms = useCallback(() => currentLMSPrefs && sendToLMS(currentLMSPrefs), [currentLMSPrefs, sendToLMS])
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
      tags: resourceData.collections.edges.filter(isEdgeNodeOfType(['Collection'])).map(({ node: { name } }) => name),

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
      sendToMoodleLms: currentLMSPrefs ? sendToMoodleLms : undefined,
    }
    return props
  }, [
    currentLMSPrefs,
    sendToMoodleLms,
    deleteResource,
    resourceData,
    id,
    formBag,
    isOwner,
    liked,
    creator,
    creatorEdge,
    isAuthenticated,
    formik.submitForm,
    toggleLike,
    myBookmarkedEdgeId,
    toggleBookmark,
  ])
  return resourceProps && [resourceProps]
}
