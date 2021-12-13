import { SockOf } from '../../../lib/plug'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { bRules, operators } from '../../../ports/content-graph/node/edit'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'mustBeCreatorOfNodeOrSelf' | 'nonEmptyName'

export const editNodeBRules: SockOf<typeof bRules> = async ({ arg, sessionEnv }) => {
  if (!sessionEnv.authId) {
    return null
  }

  const { or, bv } = await baseOperators()
  const assertions: Assertions<Rules> = {
    nonEmptyName: bv(!!arg.data.name),
  }

  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }

  const { isCreator, graphNode, isSameNode } = await graphOperators()
  const { editNode } = await operators()
  if (arg.nodeId._type === 'Profile') {
    arg.data._published = undefined
  }

  assertions.mustBeCreatorOfNodeOrSelf = or(
    isSameNode(graphNode(sessionEnv.authId), editNode),
    isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: editNode }),
  )

  return { ...arg, assertions }
}
