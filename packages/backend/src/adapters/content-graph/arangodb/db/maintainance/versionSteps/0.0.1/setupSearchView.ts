import { Database } from 'arangojs'
import { ArangoSearchViewLink } from 'arangojs/view'

export const SearchViewName = 'SearchView'
export const setupSearchView = async ({ db }: { db: Database }) => {
  let searchView = db.view(SearchViewName)
  const textAnalyzer = db.analyzer('global-text-search')
  await textAnalyzer.create({
    type: 'text',
    properties: { case: 'upper', locale: 'en', stemming: true, edgeNgram: { max: 6, min: 2, preserveOriginal: true } },
    features: ['frequency', 'norm', 'position'],
  })

  const contentAnalyzer: ArangoSearchViewLink = {
    analyzers: ['text_en', 'global-text-search'],
    fields: {
      description: {},
      name: {},
    },
    includeAllFields: false,
    storeValues: 'none',
    trackListPositions: false,
  }

  searchView = await db.createView(SearchViewName, {
    links: {
      Resource: contentAnalyzer,
      Collection: contentAnalyzer,
      Iscedf: contentAnalyzer,
    },
  })

  return searchView
}
