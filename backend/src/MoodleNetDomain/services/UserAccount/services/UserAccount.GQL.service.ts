import { MoodleNet } from '../../..'
import { getGQLApiResponder } from '../../../../lib/domain'
import { getUserAccountSchema } from '../graphql/schema'

getUserAccountSchema().then((userAccountSchema) => {
  MoodleNet.respondApi({
    api: 'UserAccount.GQL',
    handler: getGQLApiResponder({ schema: userAccountSchema }),
  })
})
