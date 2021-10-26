import { AddEdgeAssumptionsFactory, AddEdgeAssumptionsFactoryOps, AddEdgeAssumptionsMap } from '../graph-lang/AddEdge'

export const getAddEdgeAssumptionsMap = async () => addEdgeAssumptionsMap
//export const getAddEdgeAssumptionsMap : SecOf< typeof getAddEdgeAssumptionsMap>=async ()=>addEdgeAssumptionsMap

const isCreatorBV =
  (from = false) =>
  ({
    graphOperators: { isCreator },
    addEdgeOperators: { fromNode, toNode, issuerNode },
  }: AddEdgeAssumptionsFactoryOps) => {
    return isCreator({
      authNode: issuerNode,
      ofNode: from ? fromNode : toNode,
    })
  }
const isCreatorAssumption =
  (from?: boolean): AddEdgeAssumptionsFactory =>
  async ops => ({
    isCreator: isCreatorBV(from)(ops),
  })
const isNotCreatorAssumptionsFactory =
  (from?: boolean): AddEdgeAssumptionsFactory =>
  async ops => ({
    isNotCreator: ops.baseOperators.not(isCreatorBV(from)(ops)),
  })

export const addEdgeAssumptionsMap: AddEdgeAssumptionsMap = {
  Collection_Features_Resource: isCreatorAssumption(),
  Profile_Bookmarked_Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Bookmarked_Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Likes_Resource: isNotCreatorAssumptionsFactory(),
  // Profile_Follows_Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Follows_Collection: isNotCreatorAssumptionsFactory(),
  Profile_Follows_IscedField: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Follows_Profile: async ({
    addEdgeOperators: { issuerNode, toNode },
    graphOperators: { isSameNode },
    baseOperators: { not },
  }) => ({
    notToMyself: not(isSameNode(issuerNode, toNode)),
  }),
  Resource_Features_IscedField: isCreatorAssumption(true),
  Resource_Features_IscedGrade: isCreatorAssumption(true),
  Resource_Features_ResourceType: isCreatorAssumption(true),
  Resource_Features_Language: isCreatorAssumption(true),
  Resource_Features_License: isCreatorAssumption(true),
  Resource_Features_FileFormat: isCreatorAssumption(true),
}
