import { AddNodeAssumptionsFactoryMap } from '../graph-lang/AddNode'

export const addNodeAssumptionsMap: AddNodeAssumptionsFactoryMap = {
  Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
}
