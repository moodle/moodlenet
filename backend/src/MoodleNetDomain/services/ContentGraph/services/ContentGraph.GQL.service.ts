import { MoodleNet } from '../../..'
import { getGQLApiResponder } from '../../../../lib/domain'
import { getContentGraphExecutableSchema } from '../graphql/schema'

getContentGraphExecutableSchema().then((schema) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.GQL',
    handler: getGQLApiResponder({ schema }),
  })
})
