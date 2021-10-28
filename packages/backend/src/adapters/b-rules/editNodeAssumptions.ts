import {
  EditNodeAssumptionsFactory,
  EditNodeAssumptionsFactoryMap,
  EditNodeAssumptionsFactoryOps,
} from '@moodlenet/common/lib/content-graph/bl/graph-lang/EditNode'

const isCreatorBV = ({
  editNodeOperators: { node },
  graphOperators: { isCreator, graphNode },
  sessionEnv,
}: EditNodeAssumptionsFactoryOps) => {
  return isCreator({
    authNode: graphNode(sessionEnv.authId),
    ofNode: node,
  })
}

const isCreatorAssumption: EditNodeAssumptionsFactory = async ops => ({
  isCreator: isCreatorBV(ops),
})
export const editNodeAssumptionsMap: EditNodeAssumptionsFactoryMap = {
  Collection: isCreatorAssumption,
  Resource: isCreatorAssumption,
}
export const getEditNodeAssumptionsMap = async () => editNodeAssumptionsMap
