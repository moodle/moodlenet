import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { SearchPage } from '../../../../ContentGraph.graphql.gen'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { aqlMergeTypenameById, makePage, skipLimitPagination } from './helpers'

export const globalSearch: ContentGraphPersistence['globalSearch'] = async ({ text, page }) => {
  const { db } = await DBReady()
  const { limit, skip } = skipLimitPagination({ page })

  const query = `
        FOR node IN SearchView
        SEARCH ANALYZER(
            BOOST(node.name IN TOKENS(${aqlstr(text)}, "text_en"), 30)
            ||
            BOOST(node.summary IN TOKENS(${aqlstr(text)}, "text_en"), 10)
            ||
            BOOST(NGRAM_MATCH(node.name, ${aqlstr(text)}, 0.05, "global-search-ngram"), 1)
            ||
            BOOST(NGRAM_MATCH(node.summary, ${aqlstr(text)}, 0.05, "global-search-ngram"), 0.5)
          , "text_en")
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
