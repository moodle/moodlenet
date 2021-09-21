import { aq, AqlVar } from '../../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../../types'

export const getProfileByAuthIdQ = ({ authIdVar }: { authIdVar: AqlVar }) => {
  const q = aq<AqlGraphNodeByType<'Profile'>>(`
    FOR profile IN Profile
      FILTER profile._authId == ${authIdVar}
      LIMIT 1
    return profile 
  `)
  // console.log({ getProfileByAuthIdQ: q })
  return q
}
