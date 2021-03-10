import * as GQL from '../../../../ContentGraph.graphql.gen'
import { globalSearch } from '../../apis/globalSearch'

export const gqlGlobalSearch: GQL.QueryResolvers['globalSearch'] = async (_root, { text, page } /* , ctx ,_info */) => {
  const searchPage = await globalSearch({ text, page })
  return searchPage
}
