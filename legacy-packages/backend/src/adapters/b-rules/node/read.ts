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
  const { and, or } = await baseOperators()
  const { creatorOf, isCreator, graphNode, isPublished, isSameNode } = await graphOperators()
  const { readNode } = await operators()
  const assertions: Assertions<Rules> = {
    mustBePublishedOrIssuerIsCreatorOfNode: or(
      isSameNode(readNode, graphNode(sessionEnv.authId)),
      isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: readNode }),
      and(isPublished(creatorOf(readNode)), isPublished(readNode)),
    ),
  }

  return { ...arg, assertions }
}
