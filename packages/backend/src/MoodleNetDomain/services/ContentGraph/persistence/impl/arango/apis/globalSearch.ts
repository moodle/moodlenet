import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

// TODO: we need just a "findNode" function :
// TODO: should not get nodeType, it should infer it from _id instead
// TODO: gets ctx, lookups policy and prepares filter.
// TODO: ctx.auth&policy shall include "System" option
export const globalSearch: ContentGraphPersistence['globalSearch'] = async ({ text }) => {
  const { db } = await DBReady()
  if (!text) {
    return []
  }
  const query = `
    FOR node IN SearchView
      SEARCH ANALYZER(
        BOOST(node.name IN TOKENS(${aqlstr(text)} ,"text_en"), 5)
        ||
        node.summary IN TOKENS(${aqlstr(text)} ,"text_en")
        ,"text_en")
    
      SORT TFIDF(node) desc
        
    LIMIT 10
    RETURN node
    `
  // console.log(query)

  const cursor = await db.query(query)

  const docs = await cursor.all()
  cursor.kill()

  return docs
}
