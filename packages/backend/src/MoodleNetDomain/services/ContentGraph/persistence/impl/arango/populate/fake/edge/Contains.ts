// import fk from 'faker'
import { CreateEdgeInput, EdgeType } from '../../../../../../ContentGraph.graphql.gen'
import { Just } from '../types'

export const Contains = (): Just<CreateEdgeInput[EdgeType.Contains]> => {
  return {}
}
