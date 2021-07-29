import { ContentGraphDB } from '../types'

const GRAPH_NAME = 'contentGraph'
const SEARCH_VIEW = 'SearchView'

export const getGraph = async (db: ContentGraphDB) => db.graph(GRAPH_NAME)
export const getSearchView = async (db: ContentGraphDB) => db.view(SEARCH_VIEW)
