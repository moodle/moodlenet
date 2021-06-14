import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { Maybe } from 'graphql/jsutils/Maybe'
import * as GQLResolvers from '../../../../graphql/types.graphql.gen'
import { ShallowNode } from '../../../../graphql/types.node'
import { SessionEnv } from '../../../../lib/auth/types'
import { getOneResult } from '../../../../lib/helpers/arango'
import { getNode } from '../functions/getNode'

export const nodePropResolver =
  <Parent>(prop: keyof Parent, db: Database): GQLResolvers.Resolver<Maybe<ShallowNode>, Parent, SessionEnv> =>
  async (
    par,
    _x,
    /* env  ,_info  */
  ) => {
    //TODO: try the following
    //const prop = _info.fieldName
    const id = (par[prop] as any)?._id
    if (!id) {
      return null
    }
    const { nodeType, _key } = parseNodeId(id)
    const q = getNode({ _key, nodeType })
    const maybeNode = getOneResult(q, db)
    return maybeNode
  }
