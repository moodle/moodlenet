import { object, ObjectSchema, ValidationError } from 'yup'
import { CreateEdgeInput, EdgeType } from '../../../ContentGraph.graphql.gen'

type Just<T> = Exclude<T, null | undefined>
const inputObjectValidators: {
  [T in EdgeType]: ObjectSchema<Just<CreateEdgeInput[T]>>
} = {
  Follows: object<Just<CreateEdgeInput['Follows']>>().required(),
}

export function validateCreateEdgeInput(input: CreateEdgeInput): Just<CreateEdgeInput[EdgeType]> | Error {
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
