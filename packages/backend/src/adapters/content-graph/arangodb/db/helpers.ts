import { Database } from 'arangojs'

const GRAPH_NAME = 'contentGraph'
const SEARCH_VIEW = 'SearchView'

export const getGraph = async (db: Database) => db.graph(GRAPH_NAME)
export const getSearchView = async (db: Database) => db.view(SEARCH_VIEW)
