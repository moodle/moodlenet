import { BV } from '.'
import { GraphNodeIdentifier } from '../../types/node'

export type GraphValues = {
  isCreator(_: { creatorId: BV<GraphNodeIdentifier>; nodeId: BV<GraphNodeIdentifier> }): BV<boolean>
}
