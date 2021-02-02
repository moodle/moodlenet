import * as Yup from 'yup'
import { CreateNodeInput, NodeType } from '../../../ContentGraph.graphql.gen'
import { neverCreate } from '../helpers'

type Just<T> = Exclude<T, null | undefined>
const inputObjectValidators: {
  [T in NodeType]: Yup.ObjectSchema<Just<CreateNodeInput[T]>>
} = {
  Subject: Yup.object<Just<CreateNodeInput['Subject']>>({
    name: Yup.string().required(),
  }).required(),
  User: neverCreate(NodeType.User),
}

export function validateCreateNodeInput(
  input: CreateNodeInput
): Just<CreateNodeInput[NodeType]> | Error {
  const { nodeType } = input
  if (!(nodeType in input)) {
    return new Yup.ValidationError(
      `wants to create ${nodeType} but no data provided in ${nodeType} prop`,
      undefined,
      nodeType
    )
  }
  const validator = inputObjectValidators[nodeType]
  try {
    return validator.validateSync(input[nodeType])
  } catch (err) {
    return err as Yup.ValidationError
  }
}
