import { GraphQLDomainApi } from '../../../lib/domain/api/types'
import { ContentGraphContext } from './graphql/types'

export type ContentGraph = {
  GQL: GraphQLDomainApi<ContentGraphContext>
}
