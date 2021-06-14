import { Database } from 'arangojs'
import { ArangoSearchViewLink } from 'arangojs/view'

export const SearchViewName = 'SearchView'
export const setupSearchView = async ({ db }: { db: Database }) => {
  let searchView = db.view(SearchViewName)
  const contentAnalyzer: ArangoSearchViewLink = {
    analyzers: ['text_en', 'global-search-ngram'],
    fields: { summary: {}, name: {} },
    includeAllFields: false,
    storeValues: 'none',
    trackListPositions: false,
  }
  const ngramAnalyzer = db.analyzer('global-search-ngram')
  await ngramAnalyzer.create({
    type: 'ngram',
    properties: { max: 6, min: 3, preserveOriginal: true },
    features: ['frequency', 'norm', 'position'],
  })
  searchView = await db.createView(SearchViewName, {
    links: {
      Resource: contentAnalyzer,
      Collection: contentAnalyzer,
      SubjectField: contentAnalyzer,
    },
  })

  return searchView
}
