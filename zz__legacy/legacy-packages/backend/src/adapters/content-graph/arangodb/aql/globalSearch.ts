import { GlobalSearchNodeType } from '@moodlenet/common/dist/content-graph/types/global-search'
import { GraphNode } from '@moodlenet/common/dist/content-graph/types/node'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../lib/plug'
import { AdapterArg, operators, Operators } from '../../../../ports/content-graph/search/byTerm'
import { _aqlBv } from '../adapters/bl/baseOperators'
import { aqlGraphNode2GraphNode, forwardSkipLimitPagination, getAqlAssertions } from './helpers'
import { nodeRelationCountQ } from './queries/nodeRelationCount'

export const globalSearchQuery = <NType extends GlobalSearchNodeType = GlobalSearchNodeType>({
  page,
  text,
  nodeTypes,
  sort,
  assertions,
  publishedOnly,
}: AdapterArg<NType>) => {
  const { limit, skip } = forwardSkipLimitPagination({ page })
  const aqlAssertions = getAqlAssertions(assertions)

  const nodeTypeConditions = nodeTypes?.length
    ? nodeTypes.map(nodeType => `searchNode._type == ${aqlstr(nodeType)}`).join(' || ')
    : null

  const filterConditions =
    [nodeTypeConditions]
      .filter(Boolean)
      .map(_ => `(${_})`)
      .join(' && ') || 'true'

  const sortDir = sort?.asc ? 'asc' : 'desc'
  const sortFactor =
    sort?.by === 'Popularity'
      ? `(1 + 
        ( ${nodeRelationCountQ({
          edgeType: 'Follows',
          inverse: true,
          targetNodeTypes: ['Profile', 'Organization'],
          parentNode: _aqlBv(aqlGraphNode2GraphNode('searchNode')),
          assertions: {},
        })} )
        +
        ( ${nodeRelationCountQ({
          edgeType: 'Likes',
          inverse: true,
          targetNodeTypes: ['Profile', 'Organization'],
          parentNode: _aqlBv(aqlGraphNode2GraphNode('searchNode')),
          assertions: {},
        })} )
        )
        `
      : '1'
  const isSortRecent = sort?.by === 'Recent'
  const query = aq<GraphNode<NType>>(`
    let searchTerm = ${aqlstr(text)}
      FOR searchNode IN SearchView
        SEARCH ANALYZER(
          !searchTerm ? 1 : 
          BOOST( PHRASE(searchNode.name, searchTerm), 10 )
          OR
          BOOST( PHRASE(searchNode.description, searchTerm), 5 )
          OR
          BOOST( searchNode.name IN TOKENS(searchTerm), 3 )
          OR
          BOOST( searchNode.description IN TOKENS(searchTerm), 1 )
          OR
          BOOST( NGRAM_MATCH(searchNode.name, searchTerm, 0.05, "global-text-search"), 0.2 )
          OR
          BOOST( NGRAM_MATCH(searchNode.description, searchTerm, 0.05, "global-text-search"), 0.1 )
        , "text_en")
      
        FILTER ${publishedOnly ? `searchNode._published &&` : ``} ${aqlAssertions} && ${filterConditions} 
      
      let sortFactor = ${sortFactor}
      let rank = ( (0.1 + TFIDF(searchNode)) * sortFactor )

      SORT rank ${isSortRecent ? 'desc' : sortDir}, searchNode._created ${isSortRecent ? sortDir : 'desc'}
      
      LIMIT ${skip}, ${limit}
      
      RETURN ${aqlGraphNode2GraphNode('searchNode')}
    `)
  // console.log(query)
  // console.log('**', inspect({ query, nodeTypeConditions, nodeTypes, filterConditions, sortDir, sortFactor }))
  return { limit, skip, query }
}
export const arangoSearchByTermOperators: SockOf<typeof operators> = async () => SEARCH_BY_TERM_OPERATORS
export const SEARCH_BY_TERM_OPERATORS: Operators = {
  searchNode: _aqlBv('searchNode'),
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
