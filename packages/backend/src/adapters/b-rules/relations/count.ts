import { SockOf } from '../../../lib/plug'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { bRules, operators } from '../../../ports/content-graph/relations/count'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'mustBePublishedOrIssuerIsCreatorOfNode'

export const relationCountBRules: SockOf<typeof bRules> = async ({ arg, sessionEnv }) => {
  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }
  const { or, and } = await baseOperators()
  const { isCreator, graphNode, isPublished, creatorOf } = await graphOperators()
  const { countingNode } = await operators()
  const assertions: Assertions<Rules> = {
    mustBePublishedOrIssuerIsCreatorOfNode: or(
      and(isPublished(creatorOf(countingNode)), isPublished(countingNode)),
      isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: countingNode }),
    ),
  }

  return { ...arg, assertions }
}
