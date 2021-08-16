import { GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { GlobalSearchNodeType, GlobalSearchSortBy } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../types'
import { forwardSkipLimitPagination } from './helpers'

export const globalSearchQuery = ({
  page,
  text,
  nodeTypes,
  sortBy,
}: {
  text: string
  page: PaginationInput
  nodeTypes: GraphNodeType[]
  sortBy: GlobalSearchSortBy
}) => {
  const { limit, skip } = forwardSkipLimitPagination({ page })
  const aql_txt = aqlstr(text)

  const nodeTypeConditions = (nodeTypes ?? []).map(nodeType => `node._type == ${aqlstr(nodeType)}`).join(' OR ')

  const filterConditions = [nodeTypeConditions].filter(Boolean).join(' && ')

  const sortFactor =
    sortBy === 'Relevance'
      ? '1'
      : sortBy === 'Recent'
      ? '0'
      : '(1 + (node._relCount.Likes.from.Profile || 0) + (node._relCount.Follows.from.Profile || 0))'

  const query = aq<AqlGraphNodeByType<GlobalSearchNodeType>>(`
    let searchTerm = ${aql_txt}
      FOR node IN SearchView
        SEARCH ANALYZER(
          !searchTerm ? 1 : 
          BOOST( PHRASE(node.name, searchTerm), 10 )
          OR
          BOOST( PHRASE(node.description, searchTerm), 5 )
          OR
          BOOST( node.name IN TOKENS(searchTerm), 3 )
          OR
          BOOST( node.summary IN TOKENS(searchTerm), 1 )
          OR
          BOOST(  NGRAM_MATCH(node.name, searchTerm, 0.05, "global-text-search"), 0.2 )
          OR
          BOOST( NGRAM_MATCH(node.summary, searchTerm, 0.05, "global-text-search"), 0.1 )
        , "text_en")
      
        FILTER ${filterConditions || 'true'}
        //FILTER !$ {isMarkDeleted('node')} AND ${filterConditions || 'true'}

      SORT ( TFIDF(node) * ${sortFactor}) desc, node._key desc
      
      LIMIT ${skip}, ${limit}
      
      RETURN node
    `)
  // console.log(query)
  return { limit, skip, query }
}

// export const makeGlobalSearchGQLSearchPage = ({
//   documents,
//   skip,
// }: {
//   documents: Document[]
//   skip: number
// }): GQL.SearchPage => {
//   const results = documents.map((edge, i) => {
//     return {
//       ...edge,
//       cursor: i + skip,
//     }
//   })

//   return makePage<GQL.SearchPage>({
//     afterEdges: results,
//     beforeEdges: [],
//     pageEdgeTypename: 'SearchPageEdge',
//     pageTypename: 'SearchPage',
//   })
// }
