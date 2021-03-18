import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { Persistence } from '../types'
import { makePage, skipLimitPagination } from './helpers'

export const globalSearch = async ({
  persistence: { db },
  page,
  text,
  nodeTypes,
  sortBy = GQL.GlobalSearchSort.Pertinence,
}: {
  persistence: Persistence
  text: string
  page: Maybe<GQL.PaginationInput>
  nodeTypes: Maybe<GQL.NodeType[]>
  sortBy: Maybe<GQL.GlobalSearchSort>
}): Promise<GQL.SearchPage> => {
  const { limit, skip } = skipLimitPagination({ page })
  const aql_txt = aqlstr(text)

  const nodeTypeConditions = (nodeTypes ?? []).map(nodeType => `node.__typename == ${aqlstr(nodeType)}`).join(' || ')

  const filterConditions = [nodeTypeConditions].filter(Boolean).join(' && ')

  const filterString = filterConditions && `FILTER ${filterConditions}`

  const sortFactor =
    sortBy === GQL.GlobalSearchSort.Pertinence
      ? '1'
      : '(1 + (node._meta.relCount.Likes.from.Profile||0) + (node._meta.relCount.Follows.from.Profile||0))'

  const query = `
      FOR node IN SearchView
        SEARCH ANALYZER(
          BOOST( PHRASE(node.name, ${aql_txt}), 10 )
          ||
          BOOST( PHRASE(node.description, ${aql_txt}), 5 )
          ||
          BOOST( node.name IN TOKENS(${aql_txt}), 3 )
          ||
          BOOST( node.summary IN TOKENS(${aql_txt}), 1 )
          ||
          BOOST(  NGRAM_MATCH(node.name, ${aql_txt}, 0.05, "global-search-ngram"), 0.2 )
          ||
          BOOST( NGRAM_MATCH(node.summary, ${aql_txt}, 0.05, "global-search-ngram"), 0.1 )
        , "text_en")
      
        ${filterString}

      SORT ( TFIDF(node) * ${sortFactor}) desc, node._key 
      
      LIMIT ${skip}, ${limit}
      
      RETURN {
        node
      }
    `
  // console.log(query)
  const cursor = await db.query(query)
  const results = (await cursor.all()).map((edge, i) => {
    return {
      ...edge,
      cursor: i + skip,
    }
  })

  return makePage<GQL.SearchPage>({
    afterEdges: results,
    beforeEdges: [],
    pageEdgeTypename: 'SearchPageEdge',
    pageTypename: 'SearchPage',
  })
}
