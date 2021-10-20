import { GlobalSearchNodeType } from '@moodlenet/common/lib/content-graph/types/global-search'
import { GraphNode } from '@moodlenet/common/lib/content-graph/types/node'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { GlobalSearchInput } from '../../../../ports/content-graph/search'
import { _ } from '../adapters/bl/_'
import { aqlGraphNode2GraphNode, forwardSkipLimitPagination } from './helpers'
import { nodeRelationCountQ } from './queries/traverseEdges'

export const globalSearchQuery = <NType extends GlobalSearchNodeType = GlobalSearchNodeType>({
  page,
  text,
  nodeTypes,
  sort,
  env,
}: GlobalSearchInput<NType>) => {
  const { limit, skip } = forwardSkipLimitPagination({ page })
  const aql_txt = aqlstr(text)

  const nodeTypeConditions = nodeTypes?.length
    ? nodeTypes.map(nodeType => `node._type == ${aqlstr(nodeType)}`).join(' || ')
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
          targetNodeType: 'Profile',
          parentNode: _('node._id'),
        })} )
        +
        ( ${nodeRelationCountQ({
          edgeType: 'Likes',
          inverse: true,
          targetNodeType: 'Profile',
          parentNode: _('node._id'),
        })} )
        )
        `
      : '1'
  const isSortRecent = sort?.by === 'Recent'
  const issuerAuthId = env?.user.authId
  const query = aq<GraphNode<NType>>(`
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
          BOOST( node.description IN TOKENS(searchTerm), 1 )
          OR
          BOOST(  NGRAM_MATCH(node.name, searchTerm, 0.05, "global-text-search"), 0.2 )
          OR
          BOOST( NGRAM_MATCH(node.description, searchTerm, 0.05, "global-text-search"), 0.1 )
        , "text_en")
      
        FILTER ( node._published ${issuerAuthId ? `|| node._creatorAuthId == ${aqlstr(issuerAuthId)}` : ''} ) 
                && ${filterConditions} 
      
      let sortFactor = ${sortFactor}
      let rank = ( (0.1 + TFIDF(node)) * sortFactor )

      SORT rank ${isSortRecent ? 'desc' : sortDir}, node._created ${isSortRecent ? sortDir : 'desc'}
      
      LIMIT ${skip}, ${limit}
      
      RETURN ${aqlGraphNode2GraphNode('node')}
    `)
  // console.log('**', inspect({ query, nodeTypeConditions, nodeTypes, filterConditions, sortDir, sortFactor }))
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
