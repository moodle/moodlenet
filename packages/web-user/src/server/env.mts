import { defaultImageUploadMaxSize } from '@moodlenet/react-app/server'
import type { ValidationsConfig } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { shell } from './shell.mjs'

type Env = {
  noBgProc: boolean
}

export const env = getEnv()
export const validationsConfig: ValidationsConfig = {
  imageMaxUploadSize: defaultImageUploadMaxSize,
}
export const {
  avatarImageValidation,
  backgroundImageValidation,
  profileValidationSchema,
  displayNameSchema,
  messageFormValidationSchema,
} = getValidationSchemas(validationsConfig)

function getEnv(): Env {
  const config = shell.config ?? {}
  const env: Env = {
    noBgProc: !!config.noBgProc,
  }

  return env
}
