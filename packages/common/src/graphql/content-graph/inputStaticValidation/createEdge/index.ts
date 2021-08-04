import { ObjectSchema, ValidationError } from 'yup'
import { CreateEdgeInput, EdgeType } from '../../../types.graphql.gen'
import { neverCreate } from '../helpers'

type Just<T> = Exclude<T, null | undefined>
const inputObjectValidators: {
  [T in EdgeType]: ObjectSchema<Just<CreateEdgeInput[T]>>
} = {
  Created: neverCreate('Created'),
  HasUserRole: neverCreate('HasUserRole'),
  Contains: neverCreate('Contains'),
  Pinned: neverCreate('Pinned'),
  Follows: neverCreate('Follows'),
  // Contains: object<Just<CreateEdgeInput['Contains']>>().required(),
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
