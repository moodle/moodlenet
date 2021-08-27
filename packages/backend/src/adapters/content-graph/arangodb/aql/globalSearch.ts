import { GlobalSearchNodeType } from '@moodlenet/common/lib/content-graph/types/global-search'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { GlobalSearchInput } from '../../../../ports/content-graph/search'
import { AqlGraphNodeByType } from '../types'
import { forwardSkipLimitPagination, getOneAQFrag } from './helpers'
import { nodeRelationCountQ } from './queries/traverseEdges'

export const globalSearchQuery = <NType extends GlobalSearchNodeType = GlobalSearchNodeType>({
  page,
  text,
  nodeTypes,
  sort,
}: Omit<GlobalSearchInput<NType>, 'env'>) => {
  const { limit, skip } = forwardSkipLimitPagination({ page })
  const aql_txt = aqlstr(text)

  const nodeTypeConditions = (nodeTypes ?? []).map(nodeType => `node._type == ${aqlstr(nodeType)}`).join(' OR ')

  const filterConditions = [nodeTypeConditions].filter(Boolean).join(' && ')

  const sortDir = sort?.asc ? 'asc' : 'desc'
  const sortFactor =
    sort?.by === 'Popularity'
      ? `(1 + 
        ( ${getOneAQFrag(
          nodeRelationCountQ({
            edgeType: 'Follows',
            inverse: true,
            targetNodeType: 'Profile',
            parentNodeId: 'node._id',
          }),
        )} )
        +
        ( ${getOneAQFrag(
          nodeRelationCountQ({ edgeType: 'Likes', inverse: true, targetNodeType: 'Profile', parentNodeId: 'node._id' }),
        )} )
        )
        `
      : '1'
  const isSortRecent = sort?.by === 'Recent'

  const query = aq<AqlGraphNodeByType<NType>>(`
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
      
      let sortFactor = ${sortFactor}
      let rank = ( (0.1 + TFIDF(node)) * sortFactor )

      SORT rank ${isSortRecent ? 'desc' : sortDir}, node._rev ${isSortRecent ? sortDir : 'desc'}
      
      LIMIT ${skip}, ${limit}
      
      RETURN node
    `)
  console.log('**', query)
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
