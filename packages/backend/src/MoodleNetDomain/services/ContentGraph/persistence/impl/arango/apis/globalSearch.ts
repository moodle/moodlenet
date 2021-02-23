import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { SearchPage } from '../../../../ContentGraph.graphql.gen'
import { ContentGraphPersistence } from '../../../types'
import { aqlMergeTypenameById, paginatedQuery } from './helpers'

export const globalSearch: ContentGraphPersistence['globalSearch'] = async ({ text, page }) => {
  return paginatedQuery<SearchPage>({
    pageTypename: 'SearchPage',
    pageEdgeTypename: 'SearchPageEdge',
    cursorProp: `node._key`,
    page,
    mapQuery: page => `
      LET analyzer = "text_en"
      
      FOR node IN (
        FOR node IN SearchView
        SEARCH ANALYZER(
          BOOST(node.name IN TOKENS(${aqlstr(text)} , analyzer), 5)
          ||
          node.summary IN TOKENS(${aqlstr(text)} , analyzer)
          , analyzer)
          
          SORT TFIDF(node) desc
          RETURN node    
      )
      ${page}

      RETURN {
        cursor,
        node: ${aqlMergeTypenameById('node')}
      }
    `,
  })
}
