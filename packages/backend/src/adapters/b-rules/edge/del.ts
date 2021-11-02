import { SockOf } from '../../../lib/plug'
import { bRules, operators } from '../../../ports/content-graph/edge/del'
import { Assertions } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'mustBeCreatorOfEdge'

export const delEdgeBRules: SockOf<typeof bRules> = async ({ sessionEnv, arg }) => {
  if (!sessionEnv.authId) {
    return null
  }
  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }
  const { delEdge } = await operators()
  const { isCreator, graphNode } = await graphOperators()

  const assertions: Assertions<Rules> = {
    mustBeCreatorOfEdge: isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: delEdge }),
  }

  return { ...arg, assertions }
}
