import { SockOf } from '../../../lib/plug'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { BRules, operators } from '../../../ports/content-graph/search/byTerm'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = 'mustBePublished' | 'mustBePublishedOrIssuerIsCreatorOfNode'

export const searchNodeBRules: SockOf<BRules> = async ({ arg, sessionEnv }) => {
  const { isCreator, graphNode, isPublished } = await graphOperators()
  const { searchNode } = await operators()

  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return {
      ...arg,
      assertions: {
        mustBePublished: isPublished(searchNode),
      },
    }
  }
  const { or } = await baseOperators()
  const assertions: Assertions<Rules> = {
    mustBePublishedOrIssuerIsCreatorOfNode: or(
      isPublished(searchNode),
      isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: searchNode }),
    ),
  }

  return { ...arg, assertions }
}
