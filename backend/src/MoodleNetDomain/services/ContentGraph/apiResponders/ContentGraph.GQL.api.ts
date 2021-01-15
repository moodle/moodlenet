import { startMoodleNetGQLApiResponder } from '../../../MoodleNetGraphQL'
import { getContentGraphServiceExecutableSchemaDefinition } from '../ContentGraph.graphql.schema'

startMoodleNetGQLApiResponder({
  executableSchemaDef: getContentGraphServiceExecutableSchemaDefinition(),
  srvName: 'ContentGraph',
})
