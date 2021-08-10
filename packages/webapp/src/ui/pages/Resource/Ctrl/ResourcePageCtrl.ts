import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { nodeId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { duration } from 'moment'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { getJustAssetRefUrl, getMaybeAssetRefUrl } from '../../../../helpers/data'
import {
  categoriesOptions,
  langOptions,
  licensesOptions,
  monthOptions,
  resGradeOptions,
  resTypeOptions,
  yearsOptions,
} from '../../../../helpers/resource-relation-data-static'
import { href } from '../../../elements/link'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewResourceFormValues } from '../../NewResource/types'
// import { useFormikBag } from '../../../lib/formik'
// import { NewResourceFormValues } from '../../NewResource/types'
import { ResourceProps } from '../Resource'
import { useResourcePageDataQuery } from './ResourcePage.gen'

export type ResourceCtrlProps = { id: ID }
export const useResourceCtrl: CtrlHook<ResourceProps, ResourceCtrlProps> = ({ id }) => {
  // const { org: localOrg } = useLocalInstance()
  const { data } = useResourcePageDataQuery({ variables: { resourceId: id } })
  const resourceData = data?.node?.__typename === 'Resource' ? data.node : null

  const [formik, formBag] = useFormikBag<NewResourceFormValues>({
    initialValues: {} as any,
    onSubmit: vals => {
      console.log('save update', vals)
      alert('save update not implemented')
    },
  })
  const { setValues: fsetValues } = formik
  useEffect(() => {
    if (resourceData) {
      const { name: title, description, image, content } = resourceData
      const category =
        resourceData.categories.edges.map(e => (e.node.__typename === 'IscedField' ? e.node.name : ''))[0] ?? ''
      const level = resourceData.grades.edges.map(e => (e.node.__typename === 'IscedGrade' ? e.node.name : ''))[0] ?? ''
      const type = resourceData.types.edges.map(e => (e.node.__typename === 'ResourceType' ? e.node.name : ''))[0] ?? ''
      const language =
        resourceData.languages.edges.map(e => (e.node.__typename === 'Language' ? e.node.name : ''))[0] ?? ''
      const license =
        resourceData.licenses.edges.map(e => (e.node.__typename === 'License' ? e.node.name : ''))[0] ?? ''
      const originalDate =
        'number' === typeof resourceData.originalCreationDate ? new Date(resourceData.originalCreationDate) : null
      const originalDateMonth = originalDate ? (monthOptions.options as string[])[originalDate.getMonth()] || '' : ''
      const originalDateYear = String(originalDate?.getFullYear() ?? '')

      fsetValues({
        addToCollections: [],
        category,
        content: getJustAssetRefUrl(content),
        contentType: content.ext ? 'Link' : 'File',
        description,
        format: content.mimetype,
        image: getMaybeAssetRefUrl(image),
        language,
        level,
        license,
        name: '',
        originalDateMonth,
        originalDateYear,
        title,
        type,
      })
    }
  }, [resourceData, fsetValues])

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
        creatorProfileHref: href(creator ? nodeId2UrlPath(creator.id) : ''),
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
    }
    return props
  }, [resourceData, creator, creatorEdge, formBag, isOwner, liked])
  return resourceProps && [resourceProps]
}
