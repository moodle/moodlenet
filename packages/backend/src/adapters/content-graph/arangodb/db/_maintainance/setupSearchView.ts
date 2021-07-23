import { Database } from 'arangojs'
import { ArangoSearchViewLink } from 'arangojs/view'

export const setupSearchView = async ({ db }: { db: Database }) => {
  const viewName = 'SearchView'
  let searchView = db.view(viewName)
  // const props = await searchView.properties()
  // console.log(inspect(props, false, 10))
  // await searchView.drop()
  if (!(await searchView.exists())) {
    const contentAnalyzer: ArangoSearchViewLink = {
      analyzers: ['text_en', 'global-text-search'],
      fields: { summary: {}, name: {} },
      includeAllFields: false,
      storeValues: 'none',
      trackListPositions: false,
    }
    const ngramAnalyzer = db.analyzer('global-text-search')
    ;(await ngramAnalyzer.exists()) && (await ngramAnalyzer.drop())
    await ngramAnalyzer.create({
      type: 'ngram',
      properties: { max: 6, min: 3, preserveOriginal: true },
      features: ['frequency', 'norm', 'position'],
    })
    searchView = await db.createView(viewName, {
      links: {
        Resource: contentAnalyzer,
        Collection: contentAnalyzer,
        Iscedfield: contentAnalyzer,
      },
    })
  }

  return searchView
}
