import { MoodleNet } from '../../..'
import { getContentGraphPersistence } from '../ContentGraph.env'

getContentGraphPersistence().then(({ createUserFollowsUser }) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.Follows.Create_User_Follows_User',
    async handler({ req: { followed, follower } }) {
      const edge = await createUserFollowsUser({ followed, follower })
      if (typeof edge === 'string') {
        return { edge }
      }

      return { edge }
    },
  })
})
