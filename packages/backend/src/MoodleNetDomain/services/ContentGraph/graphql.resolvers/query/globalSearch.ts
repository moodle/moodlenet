import { getContentGraphPersistence } from '../../ContentGraph.env'
import * as GQL from '../../ContentGraph.graphql.gen'

export const globalSearch: GQL.Resolvers['Query']['globalSearch'] = async (
  _root,
  { text, page } /* , ctx ,_info */,
) => {
  const { globalSearch } = await getContentGraphPersistence()
  const searchPage = await globalSearch({ text, page })
  return searchPage
}
