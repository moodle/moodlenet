import { Database } from 'arangojs'
import { ArangoSearchViewLink } from 'arangojs/view'
import memo from 'lodash/memoize'
import * as Yup from 'yup'
import { createDatabaseIfNotExists } from '../../../../../../lib/helpers/arango'
import { getGraph } from './setupGraph'

interface ArangoContentGraphPersistenceEnv {
  url: string[]
  databaseName: string
}

const Validator = Yup.object<ArangoContentGraphPersistenceEnv>({
  url: Yup.array(Yup.string().required()).required(),
  databaseName: Yup.string().required().default('ContentGraph'),
})

const ARANGO_URL = process.env.CONTENTGRAPH_ARANGO_URL?.split(';')
const ARANGO_DB = process.env.CONTENTGRAPH_ARANGO_DB

export const env = Validator.validateSync({
  url: ARANGO_URL,
  databaseName: ARANGO_DB,
})!

export const getDB = memo(() =>
  createDatabaseIfNotExists({
    dbConfig: { url: env.url },
    name: env.databaseName,
    dbCreateOpts: {},
  }),
)

export const DBReady = memo(async () => {
  const db = await getDB()
  //const graph = await setupGraph({ db })
  const graph = await getGraph({ db })
  const searchView = await setupSearchView({ db })
  return {
    db,
    graph,
    searchView,
  }
})

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
      },
    })
  }

  return searchView
}
