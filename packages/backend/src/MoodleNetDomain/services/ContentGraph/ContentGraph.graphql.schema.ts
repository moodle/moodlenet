import { ServiceExecutableSchemaDefinition } from '../../MoodleNetGraphQL'
import { getGraphQLTypeResolvers } from './graphql.resolvers'

export const getContentGraphServiceExecutableSchemaDefinition = async (): Promise<ServiceExecutableSchemaDefinition> => {
  const resolvers = getGraphQLTypeResolvers()

  return { resolvers }
}
