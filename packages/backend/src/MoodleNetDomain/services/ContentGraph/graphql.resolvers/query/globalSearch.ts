import { getContentGraphPersistence } from '../../ContentGraph.env'
import * as GQL from '../../ContentGraph.graphql.gen'
import { fakeUnshallowNodeForResolverReturnType } from '../helpers'

export const globalSearch: GQL.Resolvers['Query']['globalSearch'] = async (_root, { text } /* , ctx ,_info */) => {
  const { globalSearch } = await getContentGraphPersistence()
  const nodes = await globalSearch({ text })
  return nodes.map(fakeUnshallowNodeForResolverReturnType)
}
