import fk from 'faker'
import { CreateNodeInput, NodeType } from '../../../ContentGraph.graphql.gen'
import { Just } from '../types'

export const Subject = (): Just<CreateNodeInput[NodeType.Subject]> => {
  return {
    name: `${fk.random.word()} ${fk.name.jobArea()}`,
  }
}
