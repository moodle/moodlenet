import { t } from '@lingui/macro'
import { isEdgeNodeOfType } from '@moodlenet/common/lib/graphql/helpers'
import { useEffect, useMemo } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { useSeo } from '../../../../context/Global/Seo'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useIscedfCardCtrl } from '../../../components/cards/SubjectCard/Ctrl/IscedfCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { SearchProps } from '../Search'
import { useSearchUrlQuery } from './useSearchUrlQuery'

export const useSearchCtrl: CtrlHook<SearchProps, {}> = () => {
  const { text, sort, setSort } = useSearchUrlQuery()
  // const [sort, setSort] = useState<GlobalSearchSort>({ by: 'Popularity' })
  const { updateSeoMeta } = useSeo()
  useEffect(() => {
    console.log(`updateSeoMeta ${text}`)
    updateSeoMeta({
      title: t`find "${text}"`,
    })
  }, [updateSeoMeta, text])

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
      smallProfileCardPropsList: null,
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
        // console.log({ by, dir })
        setSort({ by, asc: dir === 'less' })
      },
    },
  }

  return [searchUIProps]
}
