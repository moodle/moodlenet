import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { duration } from 'moment'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
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
} from '../../../../helpers/category-relation-data-static-and-utils'
import { getJustAssetRefUrl, getMaybeAssetRefUrl } from '../../../../helpers/data'
import { href } from '../../../elements/link'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { useCreateCategoryRelationMutation } from '../../NewCategory/Ctrl/NewCategoryCtrl.gen'
import { NewCategoryFormValues } from '../../NewCategory/types'
// import { useFormikBag } from '../../../lib/formik'
// import { NewCategoryFormValues } from '../../NewCategory/types'
import { CategoryProps } from '../Category'
import { useCategoryPageDataQuery, useDelCategoryRelationMutation, useEditCategoryMutation } from './CategoryPage.gen'

export type CategoryCtrlProps = { id: ID }
export const useCategoryCtrl: CtrlHook<CategoryProps, CategoryCtrlProps> = ({ id }) => {
  // const { org: localOrg } = useLocalInstance()
  const { data, refetch } = useCategoryPageDataQuery({ variables: { categoryId: id } })
  const categoryData = data?.node?.__typename === 'Category' ? data.node : null
  const [createCategoryRelMut /* , createCategoryRelMutRes */] = useCreateCategoryRelationMutation()
  const [delCategoryRelMut /* , delCategoryRelMutRes */] = useDelCategoryRelationMutation()
  const [edit /* , editResult */] = useEditCategoryMutation()
  const categoryEdge = useMemo(() => categoryData?.categories.edges[0], [categoryData])
  const levelEdge = useMemo(() => categoryData?.grades.edges[0], [categoryData])
  const typeEdge = useMemo(() => categoryData?.types.edges[0], [categoryData])
  const languageEdge = useMemo(() => categoryData?.languages.edges[0], [categoryData])
  const licenseEdge = useMemo(() => categoryData?.licenses.edges[0], [categoryData])

  const categoryNode = useMemo(() => (categoryEdge?.node.__typename === 'IscedField' ? categoryEdge.node : null), [
    categoryEdge,
  ])
  const levelNode = useMemo(() => (levelEdge?.node.__typename === 'IscedGrade' ? levelEdge.node : null), [levelEdge])
  const typeNode = useMemo(() => (typeEdge?.node.__typename === 'CategoryType' ? typeEdge.node : null), [typeEdge])
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

  const [formik, formBag] = useFormikBag<NewCategoryFormValues>({
    initialValues: {} as any,
    onSubmit: async vals => {
      console.log('save update', vals)
      if (!categoryData) {
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
          languageEdge && delCategoryRelMut({ variables: { edge: { id: languageEdge.edge.id } } }),
          createCategoryRelMut({
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
          licenseEdge && delCategoryRelMut({ variables: { edge: { id: licenseEdge.edge.id } } }),
          createCategoryRelMut({
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
          typeEdge && delCategoryRelMut({ variables: { edge: { id: typeEdge.edge.id } } }),
          createCategoryRelMut({
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
          levelEdge && delCategoryRelMut({ variables: { edge: { id: levelEdge.edge.id } } }),
          createCategoryRelMut({
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
          categoryEdge && delCategoryRelMut({ variables: { edge: { id: categoryEdge.edge.id } } }),
          createCategoryRelMut({
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
    if (categoryData) {
      const { name: title, description, image, content } = categoryData
      const orgDateStrings = getOriginalCreationStringsByTimestamp(categoryData.originalCreationDate)
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
  }, [categoryData, fresetForm, category, language, level, license, type])

  const creatorEdge = useMemo(() => {
    return categoryData?.creator.edges[0]
  }, [categoryData])

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
  const categoryProps = useMemo<null | CategoryProps>(() => {
    if (!categoryData) {
      return null
    }
    const props: CategoryProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      formBag,
      title: categoryData.name,
      isOwner,
      liked,
      contributorCardProps: {
        avatarUrl: getMaybeAssetRefUrl(creator?.avatar) ?? '',
        creatorProfileHref: href(creator ? nodeId2UrlPath(creator.id) : ''),
        displayName: creator?.name ?? '',
        timeSinceCreation: creatorEdge
          ? duration(creatorEdge.edge._created - new Date().valueOf(), 'milliseconds').humanize(true)
          : '?',
      },
      categoryActionsCard: {},
      tags: categoryData.collections.edges
        .map(_ => (_.node.__typename === 'Collection' && _.node.name) || null)
        .filter(isJust),

      languages: langOptions,
      levels: resGradeOptions,
      types: resTypeOptions,
      months: monthOptions,
      years: yearsOptions,
      categories: categoriesOptions,
      licenses: licensesOptions,
      updateCategory: formik.submitForm,
    }
    return props
  }, [categoryData, creator, creatorEdge, formBag, isOwner, liked, formik.submitForm])
  return categoryProps && [categoryProps]
}
