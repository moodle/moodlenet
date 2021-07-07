import { BLVal, GraphOperators } from '@moodlenet/common/lib/lib/bl/common'
import { aqlstr } from '../../../../lib/helpers/arango'
import { isMarkDeleted } from '../functions/helpers'

export const edgeExists: GraphOperators['edgeExists'] = (from, edge, to) => {
  return `LENGTH( 
    FOR e in ${edge} 
      FILTER !${isMarkDeleted('e')}
              && e._from == ${aqlstr(from)}
              && e._to == ${aqlstr(to)}
      LIMIT 1
    RETURN e
  ) == 1` as BLVal<boolean>
}

export const isCreator: GraphOperators['isCreator'] = (ownerProfileId, nodeId) => {
  return edgeExists(ownerProfileId, 'Created', nodeId)
}

export const graphOperators: GraphOperators = {
  edgeExists,
  isCreator,
}
