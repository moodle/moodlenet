import { startMoodleNetGQLApiResponder } from '../../../MoodleNetGraphQL'
import { getUserAccountServiceExecutableSchemaDefinition } from '../UserAccount.graphql.schema'

startMoodleNetGQLApiResponder({
  executableSchemaDef: getUserAccountServiceExecutableSchemaDefinition(),
  srvName: 'UserAccount',
})
