import { SockOf } from '../../../lib/plug'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { BRules, operators } from '../../../ports/content-graph/search/byTerm'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'mustBePublishedOrIssuerIsCreatorOfNode'

export const searchNodeBRules: SockOf<BRules> = async ({ arg, sessionEnv }) => {
  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }
  const { or } = await baseOperators()
  const { isCreator, graphNode, isPublished } = await graphOperators()
  const { searchNode } = await operators()
  const assertions: Assertions<Rules> = {
    mustBePublishedOrIssuerIsCreatorOfNode: or(
      isPublished(searchNode),
      isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: searchNode }),
    ),
  }

  return { ...arg, assertions }
}
