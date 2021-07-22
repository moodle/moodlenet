import { Database } from 'arangojs'
import { ArangoSearchViewLink } from 'arangojs/view'

export const SearchViewName = 'SearchView'
export const redefineSearchView = async ({ db }: { db: Database }) => {
  const searchView = db.view(SearchViewName)

  const textAnalyzer = db.analyzer('global-text-search')
  await textAnalyzer.create({
    type: 'text',
    properties: { case: 'upper', locale: 'en', stemming: true, edgeNgram: { max: 6, min: 2, preserveOriginal: true } },
    features: ['frequency', 'norm', 'position'],
  })

  const contentAnalyzer: ArangoSearchViewLink = {
    analyzers: ['text_en', 'global-text-search'],
    fields: { summary: {}, name: {} },
    includeAllFields: false,
    storeValues: 'none',
    trackListPositions: false,
  }

  await searchView.replaceProperties({
    links: {
      Resource: contentAnalyzer,
      Collection: contentAnalyzer,
      SubjectField: contentAnalyzer,
    },
  })

  const old_ngram_analyzer = db.analyzer('global-search-ngram')
  if (await old_ngram_analyzer.exists()) {
    await old_ngram_analyzer.drop()
  }
  return searchView
}
