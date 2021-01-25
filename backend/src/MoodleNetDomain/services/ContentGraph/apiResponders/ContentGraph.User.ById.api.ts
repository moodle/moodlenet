import { MoodleNet } from '../../..'
import { UserByIdApiHandler } from '../apis/ContentGraph.User.ById'

UserByIdApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.User.ById',
    handler,
  })
})
