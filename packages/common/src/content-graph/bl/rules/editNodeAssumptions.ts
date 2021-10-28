import {
  EditNodeAssumptionsFactory,
  EditNodeAssumptionsFactoryMap,
  EditNodeAssumptionsFactoryOps,
} from '../graph-lang/EditNode'

const isCreatorBV = ({
  editNodeOperators: { node },
  graphOperators: { isCreator, graphNode },
  env,
}: EditNodeAssumptionsFactoryOps) => {
  return isCreator({
    authNode: graphNode(env.authId),
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
