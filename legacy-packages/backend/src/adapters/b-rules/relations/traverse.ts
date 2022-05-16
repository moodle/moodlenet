import { SockOf } from '../../../lib/plug'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { bRules, operators } from '../../../ports/content-graph/relations/traverse'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'mustBePublishedOrIssuerIsCreatorOfNode'

export const relationTraverseBRules: SockOf<typeof bRules> = async ({ arg, sessionEnv }) => {
  // console.log(`isLocalOrganizationAuthId`, await isLocalOrganizationAuthId(sessionEnv.authId))
  // console.log(`sessionEnv.authId`, sessionEnv.authId)
  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }
  const { or, and } = await baseOperators()
  const { creatorOf, isSameNode, isCreator, graphNode, isPublished } = await graphOperators()
  const { traverseNode } = await operators()
  const assertions: Assertions<Rules> = {
    mustBePublishedOrIssuerIsCreatorOfNode: or(
      isSameNode(traverseNode, graphNode(sessionEnv.authId)),
      and(isPublished(creatorOf(traverseNode)), isPublished(traverseNode)),
      isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: traverseNode }),
    ),
  }
  // console.log({ assertions })
  return { ...arg, assertions }
}
