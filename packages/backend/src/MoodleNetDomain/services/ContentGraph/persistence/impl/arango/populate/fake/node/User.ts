import fk from 'faker'
import { CreateNodeInput, NodeType } from '../../../../../../ContentGraph.graphql.gen'
import { Just } from '../types'

export const User = (): Just<CreateNodeInput[NodeType.User]> => {
  return {
    name: fk.internet.userName(),
  }
}
