import { isEdgeNodeOfType } from '@moodlenet/common/lib/graphql/helpers'
import { GlobalSearchSort } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { useMemo, useState } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useIscedfCardCtrl } from '../../../components/cards/SubjectCard/Ctrl/IscedfCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { SearchProps } from '../Search'
import { useSearchUrlQuery } from './useSearchUrlQuery'

export const useSearchCtrl: CtrlHook<SearchProps, {}> = () => {
  const { /* setText, */ text } = useSearchUrlQuery()
  const [sort, setSort] = useState<GlobalSearchSort>({ by: 'Popularity' })
  const collectionsQ = useGlobalSearchQuery({
    variables: {
      sort,
      nodeTypes: ['Collection'],
      text,
    },
  })

  const resourcesQ = useGlobalSearchQuery({
    variables: {
      sort,
      nodeTypes: ['Resource'],
      text,
    },
  })

  const subjectsQ = useGlobalSearchQuery({
    variables: {
      sort,
      nodeTypes: ['IscedField'],
      text,
    },
  })

  const collections = useMemo(
    () =>
      (collectionsQ.data?.globalSearch.edges || []).filter(isEdgeNodeOfType(['Collection'])).map(({ node }) => node),
    [collectionsQ.data?.globalSearch.edges],
  )

  const resources = useMemo(
    () => (resourcesQ.data?.globalSearch.edges || []).filter(isEdgeNodeOfType(['Resource'])).map(({ node }) => node),
    [resourcesQ.data?.globalSearch.edges],
  )

  const subjects = useMemo(
    () => (subjectsQ.data?.globalSearch.edges || []).filter(isEdgeNodeOfType(['IscedField'])).map(({ node }) => node),
    [subjectsQ.data?.globalSearch.edges],
  )

  const searchUIProps: SearchProps = {
    headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),

    browserProps: {
      collectionCardPropsList: collections.map(collection =>
        ctrlHook(useCollectionCardCtrl, { id: collection.id }, `Search Collection ${collection.id} Card`),
      ),
      resourceCardPropsList: resources.map(resource =>
        ctrlHook(useResourceCardCtrl, { id: resource.id, removeAction: false }, `Search Resource ${resource.id} Card`),
      ),
      subjectCardPropsList: subjects.map(subject =>
        ctrlHook(useIscedfCardCtrl, { id: subject.id }, `Search Subject ${subject.id} Card`),
      ),
      setSortBy: (by, dir) => {
        setSort({
          by,
          asc: dir === 'less' ? true : false,
        })
      },
    },
  }

  return [searchUIProps]
}
