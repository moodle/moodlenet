// import { t } from '@lingui/macro'
// import { isEdgeNodeOfType } from '@moodlenet/common/dist/graphql/helpers'
// import { useEffect, useMemo } from 'react'
// import { useGlobalSearchQuery } from '../../../../../context/Global/GlobalSearch/globalSearch.gen'
// import { usePaginateSearch } from '../../../../../context/Global/GlobalSearch/paginate'
// import { useSeo } from '../../../../../context/Global/Seo'
// import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
// import { useCollectionCardCtrl } from '../../../molecules/cards/CollectionCard/Ctrl/CollectionCardCtrl'
// import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
// import { useSmallProfileCardCtrl } from '../../../molecules/cards/SmallProfileCard/Ctrl/SmallProfileCardCtrl'
// import { useIscedfCardCtrl } from '../../../molecules/cards/SubjectCard/Ctrl/IscedfCardCtrl'
// import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
// import { SearchProps } from '../Search'
// import { useBrowserUrlQuery } from './useSearchUrlQuery'

// export const useSearchCtrl: CtrlHook<SearchProps, {}> = () => {
//   const { text, filters, setFilters, sort, setSort } = useBrowserUrlQuery()
//   // const [sort, setSort] = useState<GlobalSearchSort>({ by: 'Popularity' })
//   const { updateSeoMeta } = useSeo()
//   useEffect(() => {
//     updateSeoMeta({
//       title: t`search` + ' ' + text,
//     })
//   }, [updateSeoMeta, text])

//   const collectionsQ = useGlobalSearchQuery({
//     variables: {
//       sort,
//       nodeTypes: ['Collection'],
//       text,
//       page: { first: 20 },
//     },
//     fetchPolicy: 'cache-and-network',
//   })
//   const collections = useMemo(
//     () =>
//       (collectionsQ.data?.globalSearch.edges || [])
//         .filter(isEdgeNodeOfType(['Collection']))
//         .map(({ node }) => node),
//     [collectionsQ.data?.globalSearch.edges]
//   )
//   const {
//     formiks: [loadMoreCollections],
//   } = usePaginateSearch(collectionsQ)

//   const profilesQ = useGlobalSearchQuery({
//     variables: {
//       sort,
//       nodeTypes: ['Profile'],
//       text,
//       page: { first: 20 },
//     },
//     fetchPolicy: 'cache-and-network',
//   })
//   const profiles = useMemo(
//     () =>
//       (profilesQ.data?.globalSearch.edges || [])
//         .filter(isEdgeNodeOfType(['Profile']))
//         .map(({ node }) => node),
//     [profilesQ.data?.globalSearch.edges]
//   )
//   const {
//     formiks: [loadMoreProfiles],
//   } = usePaginateSearch(profilesQ)

//   const resourcesQ = useGlobalSearchQuery({
//     variables: {
//       sort,
//       nodeTypes: ['Resource'],
//       text,
//       page: { first: 20 },
//     },
//     fetchPolicy: 'cache-and-network',
//   })
//   const {
//     formiks: [loadMoreResources],
//   } = usePaginateSearch(resourcesQ)
//   const resources = useMemo(
//     () =>
//       (resourcesQ.data?.globalSearch.edges || [])
//         .filter(isEdgeNodeOfType(['Resource']))
//         .map(({ node }) => node),
//     [resourcesQ.data?.globalSearch.edges]
//   )

//   const subjectsQ = useGlobalSearchQuery({
//     variables: {
//       sort,
//       nodeTypes: ['IscedField'],
//       text,
//       page: { first: 20 },
//     },
//     fetchPolicy: 'cache-and-network',
//   })
//   const {
//     formiks: [loadMoreSubjects],
//   } = usePaginateSearch(subjectsQ)
//   const subjects = useMemo(
//     () =>
//       (subjectsQ.data?.globalSearch.edges || [])
//         .filter(isEdgeNodeOfType(['IscedField']))
//         .map(({ node }) => node),
//     [subjectsQ.data?.globalSearch.edges]
//   )

//   const searchUIProps: SearchProps = useMemo(
//     () => ({
//       headerPageTemplateProps: ctrlHook(
//         useHeaderPageTemplateCtrl,
//         {},
//         'header-page-template'
//       ),
//       browserProps: {
//         smallProfileCardPropsList: profiles.map((profile) =>
//           ctrlHook(
//             useSmallProfileCardCtrl,
//             { id: profile.id },
//             `Search Profile ${profile.id} Card`
//           )
//         ),
//         collectionCardPropsList: collections.map((collection) =>
//           ctrlHook(
//             useCollectionCardCtrl,
//             { id: collection.id },
//             `Search Collection ${collection.id} Card`
//           )
//         ),
//         resourceCardPropsList: resources.map((resource) =>
//           ctrlHook(
//             useResourceCardCtrl,
//             { id: resource.id, removeAction: false },
//             `Search Resource ${resource.id} Card`
//           )
//         ),
//         subjectCardPropsList: subjects.map((subject) =>
//           ctrlHook(
//             useIscedfCardCtrl,
//             { id: subject.id },
//             `Search Subject ${subject.id} Card`
//           )
//         ),
//         setSortBy: (by, dir) => {
//           // console.log({ by, dir })
//           setSort({ by, asc: dir === 'less' })
//         },
//         loadMorePeople: loadMoreProfiles?.submitForm,
//         loadMoreCollections: loadMoreCollections?.submitForm,
//         loadMoreResources: loadMoreResources?.submitForm,
//         loadMoreSubjects: loadMoreSubjects?.submitForm,
//         setFilters,
//         initialFilters: filters,
//       },
//     }),
//     [
//       profiles,
//       collections,
//       resources,
//       subjects,
//       loadMoreProfiles?.submitForm,
//       loadMoreCollections?.submitForm,
//       loadMoreResources?.submitForm,
//       loadMoreSubjects?.submitForm,
//       setFilters,
//       filters,
//       setSort,
//     ]
//   )
//   return [searchUIProps]
// }
