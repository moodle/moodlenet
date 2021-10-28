import { DelEdgeAssumptionsFactoryMap } from '@moodlenet/common/lib/content-graph/bl/graph-lang/DelEdge'

export const delEdgeAssumptionsMap: DelEdgeAssumptionsFactoryMap = {
  Profile_Bookmarked_Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Bookmarked_Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Likes_Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Follows_Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Follows_IscedField: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Profile_Follows_Profile: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Collection_Features_Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_IscedField: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_IscedGrade: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_ResourceType: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_Language: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_License: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource_Features_FileFormat: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
}
