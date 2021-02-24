import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { SearchPage } from '../../../../ContentGraph.graphql.gen'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { aqlMergeTypenameById, makePage, skipLimitPagination } from './helpers'

export const globalSearch: ContentGraphPersistence['globalSearch'] = async ({ text, page }) => {
  const { db } = await DBReady()
  const { limit, skip } = skipLimitPagination({ page })

  const query = `
      LET analyzer = "text_en"
      
        FOR node IN SearchView
        SEARCH ANALYZER(
          BOOST(node.name IN TOKENS(${aqlstr(text)} , analyzer), 5)
          ||
          node.summary IN TOKENS(${aqlstr(text)} , analyzer)
          , analyzer)
      SORT TFIDF(node) desc, node._key
      
      LIMIT ${skip}, ${limit}
      
      RETURN {
        node: ${aqlMergeTypenameById('node')}
      }
    `
  console.log(query)
  const cursor = await db.query(query)
  const results = (await cursor.all()).map((edge, i) => {
    return {
      ...edge,
      cursor: i + skip,
    }
  })

  return makePage<SearchPage>({
    afterEdges: results,
    beforeEdges: [],
    pageEdgeTypename: 'SearchPageEdge',
    pageTypename: 'SearchPage',
  })
}
