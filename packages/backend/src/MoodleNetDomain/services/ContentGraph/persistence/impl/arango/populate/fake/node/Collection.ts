import fk from 'faker'
import { CreateNodeInput, NodeType } from '../../../../../../ContentGraph.graphql.gen'
import { Just } from '../types'

export const Collection = (): Just<CreateNodeInput[NodeType.Collection]> => {
  return {
    name: fk.random.words(4),
  }
}
