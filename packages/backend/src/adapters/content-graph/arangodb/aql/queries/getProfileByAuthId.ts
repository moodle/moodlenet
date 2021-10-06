import { GraphNode } from '@moodlenet/common/lib/content-graph/types/node'
import { aq, AqlVar } from '../../../../../lib/helpers/arango/query'
import { aqlGraphNode2GraphNode } from '../helpers'

export const getProfileByAuthIdQ = ({ authIdVar }: { authIdVar: AqlVar }) => {
  const q = aq<GraphNode<'Profile'>>(`
    FOR profile IN Profile
      FILTER profile._authId == ${authIdVar}
      LIMIT 1
    return ${aqlGraphNode2GraphNode('profile')}
  `)
  // console.log({ getProfileByAuthIdQ: q })
  return q
}
