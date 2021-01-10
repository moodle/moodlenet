import { startMoodleNetGQLApiResponder } from '../../../MoodleNetGraphQL'
import { getUserAccountSchema } from '../graphql/schema'

startMoodleNetGQLApiResponder({
  schema: getUserAccountSchema(),
  srvName: 'UserAccount',
})
