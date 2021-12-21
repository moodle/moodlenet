import { SockOf } from '../../../lib/plug'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { BRules, operators } from '../../../ports/content-graph/search/byTerm'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules = /* 'mustBePublished' | */ 'nodeAndCreatorMustBePublished' //'nodeAndCreatorMustBePublishedOrIssuerIsCreatorOfNode'

export const searchNodeBRules: SockOf<BRules> = async ({ arg, sessionEnv }) => {
  const { /* isCreator, graphNode, */ isPublished, creatorOf } = await graphOperators()
  const { searchNode } = await operators()

  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return {
      ...arg,
      assertions: {
        // mustBePublished: isPublished(searchNode),
      },
    }
  }
  const { /* or, */ and } = await baseOperators()
  const assertions: Assertions<Rules> = {
    /* or(
      isCreator({ authNode: graphNode(sessionEnv.authId), ofGlyph: searchNode }), */
    nodeAndCreatorMustBePublished: and(isPublished(creatorOf(searchNode)), isPublished(searchNode)),
    /*  ), */
  }

  return { ...arg, assertions }
}
