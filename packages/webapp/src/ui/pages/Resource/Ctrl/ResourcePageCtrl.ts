import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { duration } from 'moment'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { getJustAssetRefUrl, getMaybeAssetRefUrl } from '../../../../helpers/data'
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
import { useDelResourceRelationMutation, useEditResourceMutation, useResourcePageDataQuery } from './ResourcePage.gen'

export type ResourceCtrlProps = { id: ID }
export const useResourceCtrl: CtrlHook<ResourceProps, ResourceCtrlProps> = ({ id }) => {
  // const { org: localOrg } = useLocalInstance()
  const { data, refetch } = useResourcePageDataQuery({ variables: { resourceId: id } })
  const resourceData = data?.node?.__typename === 'Resource' ? data.node : null
  const [createResourceRelMut /* , createResourceRelMutRes */] = useCreateResourceRelationMutation()
  const [delResourceRelMut /* , delResourceRelMutRes */] = useDelResourceRelationMutation()
  const [edit /* , editResult */] = useEditResourceMutation()
  const categoryEdge = useMemo(() => resourceData?.categories.edges[0], [resourceData])
  const levelEdge = useMemo(() => resourceData?.grades.edges[0], [resourceData])
  const typeEdge = useMemo(() => resourceData?.types.edges[0], [resourceData])
  const languageEdge = useMemo(() => resourceData?.languages.edges[0], [resourceData])
  const licenseEdge = useMemo(() => resourceData?.licenses.edges[0], [resourceData])

  const categoryNode = useMemo(() => (categoryEdge?.node.__typename === 'IscedField' ? categoryEdge.node : null), [
    categoryEdge,
  ])
  const levelNode = useMemo(() => (levelEdge?.node.__typename === 'IscedGrade' ? levelEdge.node : null), [levelEdge])
  const typeNode = useMemo(() => (typeEdge?.node.__typename === 'ResourceType' ? typeEdge.node : null), [typeEdge])
  const languageNode = useMemo(() => (languageEdge?.node.__typename === 'Language' ? languageEdge.node : null), [
    languageEdge,
  ])
  const licenseNode = useMemo(() => (licenseEdge?.node.__typename === 'License' ? licenseEdge.node : null), [
    licenseEdge,
  ])

  const category = categoryNode?.name ?? ''
  const language = languageNode?.name ?? ''
  const level = levelNode?.name ?? ''
  const license = getLicenseOptField(licenseNode?.code ?? '')
  const type = typeNode?.name ?? ''

  const [formik, formBag] = useFormikBag<NewResourceFormValues>({
    initialValues: {} as any,
    onSubmit: async vals => {
      console.log('save update', vals)
      if (!resourceData) {
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
          languageEdge && delResourceRelMut({ variables: { edge: { id: languageEdge.edge.id } } }),
          createResourceRelMut({
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
          licenseEdge && delResourceRelMut({ variables: { edge: { id: licenseEdge.edge.id } } }),
          createResourceRelMut({
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
          typeEdge && delResourceRelMut({ variables: { edge: { id: typeEdge.edge.id } } }),
          createResourceRelMut({
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
          levelEdge && delResourceRelMut({ variables: { edge: { id: levelEdge.edge.id } } }),
          createResourceRelMut({
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
          categoryEdge && delResourceRelMut({ variables: { edge: { id: categoryEdge.edge.id } } }),
          createResourceRelMut({
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
          image: getMaybeAssetRefUrl(image),
          contentType: content.ext ? 'Link' : 'File',
          name: '',
          ...orgDateStrings,
          title,
        },
      })
    }
  }, [resourceData, fresetForm, category, language, level, license, type])

  const creatorEdge = useMemo(() => {
    return resourceData?.creator.edges[0]
  }, [resourceData])

  const creator = useMemo(() => {
    return creatorEdge?.node.__typename === 'Profile' ? creatorEdge?.node : undefined
  }, [creatorEdge])

  const { session } = useSession()

  const isOwner = useMemo(() => {
    if (!(creator && session)) {
      return false
    }
    return creator.id === session.profile.id
  }, [creator, session])
  const liked = false
  const resourceProps = useMemo<null | ResourceProps>(() => {
    if (!resourceData) {
      return null
    }
    const props: ResourceProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      formBag,
      title: resourceData.name,
      isOwner,
      liked,
      contributorCardProps: {
        avatarUrl: getMaybeAssetRefUrl(creator?.avatar) ?? '',
        creatorProfileHref: href(creator ? nodeGqlId2UrlPath(creator.id) : ''),
        displayName: creator?.name ?? '',
        timeSinceCreation: creatorEdge
          ? duration(creatorEdge.edge._created - new Date().valueOf(), 'milliseconds').humanize(true)
          : '?',
      },
      resourceActionsCard: {},
      tags: resourceData.collections.edges
        .map(_ => (_.node.__typename === 'Collection' && _.node.name) || null)
        .filter(isJust),

      languages: langOptions,
      levels: resGradeOptions,
      types: resTypeOptions,
      months: monthOptions,
      years: yearsOptions,
      categories: categoriesOptions,
      licenses: licensesOptions,
      updateResource: formik.submitForm,
    }
    return props
  }, [resourceData, creator, creatorEdge, formBag, isOwner, liked, formik.submitForm])
  return resourceProps && [resourceProps]
}
