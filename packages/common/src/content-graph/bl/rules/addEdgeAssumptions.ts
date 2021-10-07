import { AddEdgeAssumptionsFactoryMap } from '../graph-lang/AddEdge'

export const addEdgeAssumptionsMap: AddEdgeAssumptionsFactoryMap = {
  Collection_Features_Resource: async ({
    // env,
    // from,
    graphOperators: { isCreator },
    addEdgeOperators: { fromNode, issuerNode },
  }) => {
    return {
      isCreator: isCreator({
        authNode: issuerNode,
        ofNode: fromNode,
      }),
    }
  },
  /// move following to SET EDGES
  Profile_Bookmarked_Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Bookmarked_Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Likes_Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Follows_Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Follows_IscedField: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Follows_Profile: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_IscedField: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_IscedGrade: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_ResourceType: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_Language: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_License: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_FileFormat: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
}
