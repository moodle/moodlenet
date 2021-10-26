import {
  EditNodeAssumptionsFactory,
  EditNodeAssumptionsFactoryMap,
  EditNodeAssumptionsFactoryOps,
} from '../graph-lang/EditNode'

const isCreatorBV = ({
  editNodeOperators: { node, issuerNode },
  graphOperators: { isCreator },
}: EditNodeAssumptionsFactoryOps) => {
  return isCreator({
    authNode: issuerNode,
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
