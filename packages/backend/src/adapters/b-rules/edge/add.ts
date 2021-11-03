import { SockOf } from '../../../lib/plug'
import { BRules, operators } from '../../../ports/content-graph/edge/add'
import { Assertions, baseOperators } from '../../../ports/content-graph/graph-lang/base'
import { graphOperators } from '../../../ports/content-graph/graph-lang/graph'
import { matches, matchesAny, RelMatch } from '../../../ports/content-graph/graph-lang/match'
import { isLocalOrganizationAuthId } from '../helpers'

type Rules =
  | 'mustBeCreatorOfTarget'
  | 'mustBeCreatorOfSource'
  | 'cantBeCreatorOfTarget'
  | 'youCannotFollowYourself'
  | 'sourceMustBeYou'

export const addEdgeBRules: SockOf<BRules> = async ({ arg, rel, sessionEnv /* , to, from */ }) => {
  if (!sessionEnv.authId) {
    return null
  }
  if (await isLocalOrganizationAuthId(sessionEnv.authId)) {
    return { ...arg, assertions: {} }
  }
  if (!matchesAny(rel, allowedRelations)) {
    return null
  }

  const { fromNode, toNode } = await operators()
  const assertions: Assertions<Rules> = {}

  const { isCreator, graphNode, isSameNode } = await graphOperators()
  const { not } = await baseOperators()

  if (matchesAny(rel, [collectionFeatures, resourceFeatures])) {
    assertions.mustBeCreatorOfTarget = isCreator({
      authNode: graphNode(sessionEnv.authId),
      ofGlyph: fromNode,
    })
  }

  if (matchesAny(rel, myOwnAllowedRelations)) {
    assertions.sourceMustBeYou = isSameNode(graphNode(sessionEnv.authId), fromNode)

    if (matches(rel, profileOrOrgLikes)) {
      assertions.cantBeCreatorOfTarget = not(
        isCreator({
          authNode: graphNode(sessionEnv.authId),
          ofGlyph: toNode,
        }),
      )
    }

    if (matches(rel, profileOrOrgFollows)) {
      assertions.youCannotFollowYourself = not(isSameNode(graphNode(sessionEnv.authId), toNode))
    }
  }

  return { ...arg, assertions }
}

export const profileOrOrgLikes: RelMatch = [['Profile', 'Organization'], ['Likes'], ['Resource']]
export const profileOrOrgBookmarks: RelMatch = [['Profile', 'Organization'], ['Bookmarked'], ['Collection', 'Resource']]
export const profileOrOrgFollows: RelMatch = [
  ['Profile', 'Organization'],
  ['Follows'],
  ['Collection', 'Profile', 'Organization', 'IscedField'],
]
export const collectionFeatures: RelMatch = [['Collection'], ['Features'], ['Resource']]
export const resourceFeatures: RelMatch = [
  ['Resource'],
  ['Features'],
  ['IscedField', 'IscedGrade', 'ResourceType', 'License', 'Language'],
]
export const myOwnAllowedRelations = [profileOrOrgLikes, profileOrOrgBookmarks, profileOrOrgFollows]
export const allowedRelations = [...myOwnAllowedRelations, collectionFeatures, resourceFeatures]
