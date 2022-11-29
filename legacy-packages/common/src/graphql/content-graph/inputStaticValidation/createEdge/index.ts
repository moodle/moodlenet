import { object, ObjectSchema, ValidationError } from 'yup'
import { Empty } from '../../../scalars.graphql'
import { CreateEdgeInput, EdgeType } from '../../../types.graphql.gen'
import { neverCreate } from '../helpers'

type Just<T> = Exclude<T, null | undefined>
const inputObjectValidators: {
  [T in EdgeType]: ObjectSchema<Just<CreateEdgeInput[T]>>
} = {
  Created: neverCreate('Created'),
  Features: object<Empty>().required(),
  Follows: object<Empty>().required(),
  Likes: object<Empty>().required(),
  Bookmarked: object<Empty>().required(),
}

export const validateCreateEdgeInput = (input: CreateEdgeInput): Just<CreateEdgeInput[EdgeType]> | Error => {
  const { edgeType } = input
  if (!(edgeType in input)) {
    return new Error(`wants to create ${edgeType} but no data provided in ${edgeType} prop`)
  }
  const validator = inputObjectValidators[edgeType]
  try {
    return validator.validateSync(input[edgeType])
  } catch (err) {
    return err as ValidationError
  }
}
