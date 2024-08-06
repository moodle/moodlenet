import { SockOf } from '../../../lib/plug'
import { Assertions } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { bRules, operators } from '../../../ports/content-graph/node/del'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'mustBeCreatorOfNodeOrLocalOrg'

export const delNodeBRules: SockOf<typeof bRules> = async ({ sessionEnv, arg }) => {
  if (!sessionEnv.authId) {
    return null
  }
  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }
  const { delNode } = await operators()
  const { isCreator, graphNode } = await graphOperators()
  const assertions: Assertions<Rules> = {
    mustBeCreatorOfNodeOrLocalOrg: isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: delNode }),
  }

  return { ...arg, assertions }
}
