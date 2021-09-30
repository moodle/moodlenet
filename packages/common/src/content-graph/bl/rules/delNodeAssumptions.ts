import { DelNodeAssumptionsFactoryMap } from '../graph-lang/DelNode'

export const delNodeAssumptionsMap: DelNodeAssumptionsFactoryMap = {
  Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
}
