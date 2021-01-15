import { MoodleNet } from '../../..'
import { CreateUserFollowsUserApiHandler } from '../apis/ContentGraph.Follows.CreateUserFollowsUser'

CreateUserFollowsUserApiHandler().then((handler) =>
  MoodleNet.respondApi({
    api: 'ContentGraph.Follows.CreateUserFollowsUser',
    handler,
  })
)
