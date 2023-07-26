import { defaultImageUploadMaxSize } from '@moodlenet/react-app/server'
import type { ValidationsConfig } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'

export const validationsConfig: ValidationsConfig = {
  imageMaxUploadSize: defaultImageUploadMaxSize,
}
export const { imageValidationSchema, profileValidationSchema, displayNameSchema } =
  getValidationSchemas(validationsConfig)
