import { startMoodleNetGQLApiResponder } from '../../../MoodleNetGraphQL'
import { getContentGraphExecutableSchema } from '../graphql/schema'

startMoodleNetGQLApiResponder({
  schema: getContentGraphExecutableSchema(),
  srvName: 'ContentGraph',
})
