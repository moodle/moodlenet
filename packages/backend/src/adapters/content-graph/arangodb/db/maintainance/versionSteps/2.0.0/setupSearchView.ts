import { nodeTypes } from '@moodlenet/common/dist/content-graph/types/node'
import { Database } from 'arangojs'
import { ArangoSearchViewLink } from 'arangojs/view'

export const SearchViewName = 'SearchView'
export const contentAnalyzer: ArangoSearchViewLink = {
  analyzers: ['text_en', 'global-text-search'],
  fields: {
    description: {},
    name: {},
    lastName: {},
    firstName: {},
    subtitle: {},
    bio: {},
  },
  includeAllFields: false,
  storeValues: 'none',
  trackListPositions: false,
}
export const setupSearchView = async ({ db }: { db: Database }) => {
  console.log(`setting up View ${SearchViewName}`)
  let searchView = db.view(SearchViewName)
  const textAnalyzer = db.analyzer('global-text-search')
  await textAnalyzer.create({
    type: 'text',
    properties: { case: 'upper', locale: 'en', stemming: true, edgeNgram: { max: 8, min: 3, preserveOriginal: true } },
    features: ['frequency', 'norm', 'position'],
  })

  searchView = await db.createView(SearchViewName, {
    links: nodeTypes.reduce(
      (_, nodeType) => ({ ..._, [nodeType]: contentAnalyzer }),
      {} as Record<string, ArangoSearchViewLink>,
    ),
  })
  console.log(` ... done ${SearchViewName}`)

  return searchView
}
