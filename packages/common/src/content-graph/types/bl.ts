import { EdgeType } from '../../graphql/types.graphql.gen'
import { BLVal } from '../../lib/bl/common'
import { Slug } from './node'

export type GraphOperators = {
  edgeExists(from: Slug, edge: EdgeType, to: Slug): BLVal<boolean>
  isCreator(ownerProfileSlug: Slug, nodeSlug: Slug): BLVal<boolean>
}
