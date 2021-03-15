import { Database } from 'arangojs'
import { Graph } from 'arangojs/graph'
import { ArangoSearchView } from 'arangojs/view'
export type Persistence = {
  db: Database
  graph: Graph
  searchView: ArangoSearchView
}
