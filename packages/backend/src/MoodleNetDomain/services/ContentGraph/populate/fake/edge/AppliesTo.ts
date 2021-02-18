// import fk from 'faker'
import { CreateEdgeInput, EdgeType } from '../../../ContentGraph.graphql.gen'
import { Just } from '../types'

export const AppliesTo = (): Just<CreateEdgeInput[EdgeType.AppliesTo]> => {
  return {}
}
