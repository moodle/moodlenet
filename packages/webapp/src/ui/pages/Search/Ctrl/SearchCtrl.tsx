import { GlobalSearchSort } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo, useState } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { collectionCardWithPropList } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { resourceCardWithPropList } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { subjectCardWithPropList } from '../../../components/cards/SubjectCard/Ctrl/SubjectCardCtrl'
import { createWithProps } from '../../../lib/ctrl'
import { headerPageTemplateWithProps } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { SearchProps } from '../Search'
import { useSearchUrlQuery } from './useSearchUrlQuery'

export const [SearchCtrl, searchWithProps] = createWithProps<SearchProps, {}>(
  ({ __key, __uiComp: SearchUI, ...rest }) => {
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
          .map(edge => (edge.node.__typename === 'SubjectField' ? edge.node : null))
          .filter(isJust),
      [subjectsQ.data?.globalSearch.edges],
    )

    const searchUIProps: SearchProps = {
      headerPageTemplateWithProps: headerPageTemplateWithProps({ key: 'Search Header Page Template' }),
      collectionCardWithPropsList: collectionCardWithPropList(
        collections.map(collection => ({ id: collection.id, key: `Search Collection ${collection.id} Card` })),
      ),
      resourceCardWithPropsList: resourceCardWithPropList(
        resources.map(resource => ({ id: resource.id, key: `Search Resource ${resource.id} Card` })),
      ),
      subjectCardWithPropsList: subjectCardWithPropList(
        subjects.map(subject => ({ id: subject.id, key: `Search SubjectField ${subject.id} Card` })),
      ),
      setSortBy,
      ...rest,
    }

    return <SearchUI {...searchUIProps} key={__key} />
  },
)
