import { object, ObjectSchema, ValidationError } from 'yup'
import { EditNodeInput, NodeType } from '../../../../graphql/types.graphql.gen'
import { Just } from '../../../../utils/types'
import { neverEdit } from '../helpers'

const inputObjectStaticValidators: {
  [T in NodeType]: ObjectSchema<any /* Just<EditNodeInput[T]> */>
} = {
  IscedField: neverEdit('IscedField'),
  IscedGrade: neverEdit('IscedGrade'),
  Collection: object<any /* Just<EditNodeInput['Collection']> */>().required(),
  Resource: object<any /* Just<EditNodeInput['Resource']> */>().required(),
  Profile: object<any /* Just<EditNodeInput['Resource']> */>().required(),
  Organization: neverEdit('Organization'),
  FileFormat: neverEdit('FileFormat'),
  Language: neverEdit('Language'),
  License: neverEdit('License'),
  ResourceType: neverEdit('ResourceType'),
}

export const validateEditNodeInput = (input: EditNodeInput): Just<EditNodeInput[NodeType]> | ValidationError => {
  const { nodeType } = input
  if (!(nodeType in input)) {
    return new ValidationError(
      `wants to edit ${nodeType} but no data provided in ${nodeType} prop`,
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
