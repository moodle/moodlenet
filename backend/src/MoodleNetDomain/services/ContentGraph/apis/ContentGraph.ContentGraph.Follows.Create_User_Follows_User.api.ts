import { MoodleNet } from '../../..'
import { getContentGraphPersistence } from '../ContentGraph.env'

getContentGraphPersistence().then(({ createUserFollowUser }) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.Follows.Create_User_Follows_User',
    async handler({ req: { followed, follower } }) {
      const edge = await createUserFollowUser({ followed, follower })
      return edge
    },
  })
})
