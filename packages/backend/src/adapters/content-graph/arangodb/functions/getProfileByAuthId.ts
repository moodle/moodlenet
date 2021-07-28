import { AuthId } from '@moodlenet/common/lib/user-auth/types'
import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../types'

export const getProfileByAuthIdQ = ({ authId }: { authId: AuthId }) => {
  const q = aq<AqlGraphNodeByType<'Profile'>>(`
    FOR profile IN Profile
      FILTER profile._authId == ${aqlstr(authId)}
      LIMIT 1
    return profile 
  `)
  console.log({ getProfileByAuthIdQ: q })
  return q
}
