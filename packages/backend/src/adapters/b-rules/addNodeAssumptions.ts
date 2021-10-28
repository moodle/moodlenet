import { AddNodeAssumptionsFactoryMap } from '@moodlenet/common/lib/content-graph/bl/graph-lang/AddNode'

export const addNodeAssumptionsMap: AddNodeAssumptionsFactoryMap = {
  Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
}
