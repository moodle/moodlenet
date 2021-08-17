import { GlobalSearchSort } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo, useState } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { useCollectionCardCtrl } from '../../cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useIscedfCardCtrl } from '../../cards/SubjectCard/Ctrl/IscedfCardCtrl'
import { BrowserProps } from '../Browser'
import { useBrowserUrlQuery } from './useSearchUrlQuery'

export const useBrowserCtrl: CtrlHook<BrowserProps, {}> = () => {
  const { /* setText, */ text } = useBrowserUrlQuery()
  const [sortBy, setSortBy] = useState<GlobalSearchSort>('Popularity')
  const collectionsQ = useGlobalSearchQuery({
    variables: {
      sortBy,
      nodeTypes: ['Collection'],
      text,
    },
  })

  const resourcesQ = useGlobalSearchQuery({
    variables: {
      sortBy,
      nodeTypes: ['Resource'],
      text,
    },
  })

  const subjectsQ = useGlobalSearchQuery({
    variables: {
      sortBy,
      nodeTypes: ['SubjectField'],
      text,
    },
  })

  const collections = useMemo(
    () =>
      (collectionsQ.data?.globalSearch.edges || [])
        .map(edge => (edge.node.__typename === 'Collection' ? edge.node : null))
        .filter(isJust),
    [collectionsQ.data?.globalSearch.edges],
  )

  const resources = useMemo(
    () =>
      (resourcesQ.data?.globalSearch.edges || [])
        .map(edge => (edge.node.__typename === 'Resource' ? edge.node : null))
        .filter(isJust),
    [resourcesQ.data?.globalSearch.edges],
  )

  const subjects = useMemo(
    () =>
      (subjectsQ.data?.globalSearch.edges || [])
        .map(edge => (edge.node.__typename === 'IscedField' ? edge.node : null))
        .filter(isJust),
    [subjectsQ.data?.globalSearch.edges],
  )

  const searchUIProps: BrowserProps = {
    headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
    collectionCardPropsList: collections.map(collection =>
      ctrlHook(useCollectionCardCtrl, { id: collection.id }, `Browser Collection ${collection.id} Card`),
    ),
    resourceCardPropsList: resources.map(resource =>
      ctrlHook(useResourceCardCtrl, { id: resource.id }, `Browser Resource ${resource.id} Card`),
    ),
    subjectCardPropsList: subjects.map(subject =>
      ctrlHook(useIscedfCardCtrl, { id: subject.id }, `Browser Subject ${subject.id} Card`),
    ),
    setSortBy,
  }

  return [searchUIProps]
}
