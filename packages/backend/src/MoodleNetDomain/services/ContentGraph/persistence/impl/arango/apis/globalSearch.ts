import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { SearchPage } from '../../../../ContentGraph.graphql.gen'
import { ContentGraphPersistence } from '../../../types'
import { aqlMergeTypenameById, paginatedQuery } from './helpers'

// TODO: we need just a "findNode" function :
// TODO: should not get nodeType, it should infer it from _id instead
// TODO: gets ctx, lookups policy and prepares filter.
// TODO: ctx.auth&policy shall include "System" option
export const globalSearch: ContentGraphPersistence['globalSearch'] = async ({ text, page }) => {
  return paginatedQuery<SearchPage>({
    pageTypename: 'SearchPage',
    pageEdgeTypename: 'SearchPageEdge',
    cursorProp: `node._key`,
    page,
    mapQuery: page => `
  
    FOR node IN SearchView
      SEARCH ANALYZER(
        BOOST(node.name IN TOKENS(${aqlstr(text)} ,"text_en"), 5)
        ||
        node.summary IN TOKENS(${aqlstr(text)} ,"text_en")
        ,"text_en")
    
      SORT TFIDF(node) desc
        
      ${page}

      RETURN {
        cursor,
        node: ${aqlMergeTypenameById('node')}
      }
    `,
  })
}
