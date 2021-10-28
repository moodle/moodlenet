import { DelNodeAssumptionsFactoryMap } from '@moodlenet/common/lib/content-graph/bl/graph-lang/DelNode'

export const delNodeAssumptionsMap: DelNodeAssumptionsFactoryMap = {
  Collection: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
  Resource: async ({ baseOperators: { _ } }) => ({ just: _(true) }),
}
