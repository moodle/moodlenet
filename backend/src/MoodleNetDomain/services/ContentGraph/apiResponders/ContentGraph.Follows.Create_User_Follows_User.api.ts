import { MoodleNet } from '../../..'
import { getRespondApiHandler as Create_User_Follows_User_Handler } from '../apis/ContentGraph.Follows.Create_User_Follows_User'

Create_User_Follows_User_Handler().then((handler) =>
  MoodleNet.respondApi({
    api: 'ContentGraph.Follows.Create_User_Follows_User',
    handler,
  })
)
