import { object, ObjectSchema, ValidationError } from 'yup'
import { CreateNodeInput, NodeType } from '../../../../graphql/types.graphql.gen'
import { Just } from '../../../../utils/types'
import { neverCreate } from '../helpers'

const inputObjectStaticValidators: {
  [T in NodeType]: ObjectSchema<any /* Just<CreateNodeInput[T]> */>
} = {
  SubjectField: object<any /* Just<CreateNodeInput['SubjectField']> */>().required(),
  Collection: object<any /* Just<CreateNodeInput['Collection']> */>().required(),
  Resource: object<any /* Just<CreateNodeInput['Resource']> */>().required(),
  Profile: neverCreate('Profile'),
}

export const validateCreateNodeInput = (input: CreateNodeInput): Just<CreateNodeInput[NodeType]> | ValidationError => {
  const { nodeType } = input
  if (!(nodeType in input)) {
    return new ValidationError(
      `wants to create ${nodeType} but no data provided in ${nodeType} prop`,
      undefined,
      nodeType,
    )
  }
  const validator = inputObjectStaticValidators[nodeType]
  try {
    return validator.validateSync(input[nodeType]) as any
  } catch (err) {
    return err as ValidationError
  }
}
