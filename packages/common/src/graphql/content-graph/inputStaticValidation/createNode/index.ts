import { object, ObjectSchema, ValidationError } from 'yup'
import { CreateNodeInput, NodeType } from '../../../../graphql/types.graphql.gen'
import { Just } from '../../../../utils/types'
import { neverCreate } from '../helpers'

const inputObjectStaticValidators: {
  [T in NodeType]: ObjectSchema<any /* Just<CreateNodeInput[T]> */>
} = {
  Iscedf: object<any /* Just<CreateNodeInput['Iscedf']> */>().required(),
  Collection: object<any /* Just<CreateNodeInput['Collection']> */>().required(),
  Resource: object<any /* Just<CreateNodeInput['Resource']> */>().required(),
  UserRole: neverCreate('UserRole'),
  Profile: neverCreate('Profile'),
  Organization: neverCreate('Organization'),
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
