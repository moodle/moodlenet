import { Database } from 'arangojs'
import { contentAnalyzer, SearchViewName } from '../0.0.1/setupSearchView'

export const updateSearchViewSettings = async ({ db }: { db: Database }) => {
  console.log(`updateing View ${SearchViewName} settings`)
  let searchView = db.view(SearchViewName)

  searchView.updateProperties({
    links: {
      Profile: contentAnalyzer,
      License: contentAnalyzer,
      Organization: contentAnalyzer,
      Language: contentAnalyzer,
      IscedGrade: contentAnalyzer,
      ResourceType: contentAnalyzer,
    },
  })
  console.log(` ... done ${SearchViewName}`)

  return searchView
}
