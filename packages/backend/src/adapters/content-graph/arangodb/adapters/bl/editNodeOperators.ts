import { EditNodeOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/EditNode'
import { SockOf } from '../../../../../lib/plug'
import { getEditNodeOperatorsAdapter } from '../../../../../ports/content-graph/node'
import { _ } from './_'

export const getEditNodeOperators: SockOf<typeof getEditNodeOperatorsAdapter> = async () => editNodeOperators
export const editNodeOperators: EditNodeOperators = {
  node: _('editNode'),
  issuerNode: _('issuerNode'),
}
