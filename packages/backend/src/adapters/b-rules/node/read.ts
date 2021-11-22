import { SockOf } from '../../../lib/plug'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { bRules, operators } from '../../../ports/content-graph/node/read'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'mustBePublishedOrIssuerIsCreatorOfNode'

export const readNodeBRules: SockOf<typeof bRules> = async ({ arg, sessionEnv }) => {
  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }
  const { or } = await baseOperators()
  const { isCreator, graphNode, isPublished } = await graphOperators()
  const { readNode } = await operators()
  const assertions: Assertions<Rules> = {
    mustBePublishedOrIssuerIsCreatorOfNode: or(
      isPublished(readNode),
      isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: readNode }),
    ),
  }

  return { ...arg, assertions }
}
