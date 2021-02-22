import fk from 'faker'
import { CreateNodeInput, NodeType } from '../../../../../../ContentGraph.graphql.gen'
import { Just } from '../types'

export const Resource = (): Just<CreateNodeInput[NodeType.Resource]> => {
  return {
    name: fk.random.words(4),
  }
}
