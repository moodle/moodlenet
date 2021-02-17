import { object, ObjectSchema, string, ValidationError } from 'yup'
import { CreateNodeInput, NodeType } from '../../../ContentGraph.graphql.gen'
import { neverCreate } from '../helpers'

type Just<T> = Exclude<T, null | undefined>
const inputObjectValidators: {
  [T in NodeType]: ObjectSchema<Just<CreateNodeInput[T]>>
} = {
  Subject: object<Just<CreateNodeInput['Subject']>>({
    name: string().required(),
  }).required(),
  Collection: object<Just<CreateNodeInput['Collection']>>().required(),
  Resource: object<Just<CreateNodeInput['Resource']>>().required(),
  User: neverCreate(NodeType.User),
}

export function validateCreateNodeInput(input: CreateNodeInput): Just<CreateNodeInput[NodeType]> | Error {
  const { nodeType } = input
  if (!(nodeType in input)) {
    return new ValidationError(
      `wants to create ${nodeType} but no data provided in ${nodeType} prop`,
      undefined,
      nodeType,
    )
  }
  const validator = inputObjectValidators[nodeType]
  try {
    return validator.validateSync(input[nodeType])
  } catch (err) {
    return err as ValidationError
  }
}
