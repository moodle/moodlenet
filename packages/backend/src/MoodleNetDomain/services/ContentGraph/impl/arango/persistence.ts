import { Database } from 'arangojs'
import { Config } from 'arangojs/connection'
import { ArangoSearchViewLink } from 'arangojs/view'
import { Teardown } from '../../../../../lib/domain/types'
import { createDatabaseIfNotExists } from '../../../../../lib/helpers/arango'
import { getGraph } from './setupGraph'
import { Persistence } from './types'

export const getPersistence = async ({
  cfg,
  databaseName,
}: {
  cfg: Config
  databaseName: string
}): Promise<[Persistence, Teardown]> => {
  const db = await createDatabaseIfNotExists({ dbConfig: cfg, dbCreateOpts: {}, name: databaseName })
  const graph = await getGraph({ db })

  const searchView = await setupSearchView({ db })
  const persistence: Persistence = {
    db,
    graph,
    searchView,
  }
  return [persistence, () => persistence.db.close()]
}

const setupSearchView = async ({ db }: { db: Database }) => {
  const viewName = 'SearchView'
  let searchView = db.view(viewName)
  // const props = await searchView.properties()
  // console.log(inspect(props, false, 10))
  // await searchView.drop()
  if (!(await searchView.exists())) {
    const contentAnalyzer: ArangoSearchViewLink = {
      analyzers: ['text_en', 'global-search-ngram'],
      fields: { summary: {}, name: {} },
      includeAllFields: false,
      storeValues: 'none',
      trackListPositions: false,
    }
    const ngramAnalyzer = db.analyzer('global-search-ngram')
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
        Subject: contentAnalyzer,
      },
    })
  }

  return searchView
}
