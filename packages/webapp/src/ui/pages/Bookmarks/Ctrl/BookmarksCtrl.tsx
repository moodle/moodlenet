import { GlobalSearchSort } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo, useState } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useIscedfCardCtrl } from '../../../components/cards/SubjectCard/Ctrl/IscedfCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { SearchProps } from '../Bookmarks'
import { useSearchUrlQuery } from './useSearchUrlQuery'

export const useSearchCtrl: CtrlHook<SearchProps, {}> = () => {
  const { /* setText, */ text } = useSearchUrlQuery()
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
      nodeTypes: ['IscedField'],
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

  const searchUIProps: SearchProps = {
    headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
    collectionCardPropsList: collections.map(collection =>
      ctrlHook(useCollectionCardCtrl, { id: collection.id }, `Search Collection ${collection.id} Card`),
    ),
    resourceCardPropsList: resources.map(resource =>
      ctrlHook(useResourceCardCtrl, { id: resource.id }, `Search Resource ${resource.id} Card`),
    ),
    subjectCardPropsList: subjects.map(subject =>
      ctrlHook(useIscedfCardCtrl, { id: subject.id }, `Search Subject ${subject.id} Card`),
    ),
    setSortBy,
  }

  return [searchUIProps]
}
