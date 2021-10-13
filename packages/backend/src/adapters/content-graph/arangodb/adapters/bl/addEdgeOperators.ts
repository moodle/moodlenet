import { AddEdgeOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/AddEdge'
import { SockOf } from '../../../../../lib/plug'
import { getAddEdgeOperatorsAdapter } from '../../../../../ports/content-graph/edge'
import { _ } from './_'

export const getAddEgdeOperators: SockOf<typeof getAddEdgeOperatorsAdapter> = async () => addEdgeOperators
export const addEdgeOperators: AddEdgeOperators = {
  issuerNode: _('issuerNode'),
  fromNode: _('fromNode'),
  toNode: _('toNode'),
}
