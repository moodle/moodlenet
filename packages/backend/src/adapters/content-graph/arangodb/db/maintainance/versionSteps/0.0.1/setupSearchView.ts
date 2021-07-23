import { Database } from 'arangojs'
import { ArangoSearchViewLink } from 'arangojs/view'

export const SearchViewName = 'SearchView'
export const setupSearchView = async ({ db }: { db: Database }) => {
  let searchView = db.view(SearchViewName)
  const contentAnalyzer: ArangoSearchViewLink = {
    analyzers: ['text_en', 'global-text-search'],
    fields: { summary: {}, name: {} },
    includeAllFields: false,
    storeValues: 'none',
    trackListPositions: false,
  }
  const textAnalyzer = db.analyzer('global-text-search')
  await textAnalyzer.create({
    type: 'text',
    properties: { case: 'upper', locale: 'en', stemming: true, edgeNgram: { max: 6, min: 2, preserveOriginal: true } },
    features: ['frequency', 'norm', 'position'],
  })

  searchView = await db.createView(SearchViewName, {
    links: {
      Resource: contentAnalyzer,
      Collection: contentAnalyzer,
      Iscedfield: contentAnalyzer,
    },
  })

  return searchView
}
