import { defaultImageUploadMaxSize } from '@moodlenet/react-app/server'
import type { ValidationsConfig } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { shell } from './shell.mjs'

type Env = {
  noBgProc: boolean
  deleteInactiveUsers:
    | false
    | {
        afterNoLogInForDays: number
        notifyBeforeDays: number
      }
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
    deleteInactiveUsers: (() => {
      if (!config.deleteInactiveUsers) return false
      const afterNoLogInForDays = Math.floor(config.deleteInactiveUsers.afterNoLogInForDays)
      const notifyBeforeDays = Math.floor(config.deleteInactiveUsers.notifyBeforeDays)
      if (!afterNoLogInForDays || !notifyBeforeDays) {
        throw new Error(
          `deleteInactiveUsers config is invalid :${JSON.stringify(config.deleteInactiveUsers)}`,
        )
      }
      return {
        afterNoLogInForDays,
        notifyBeforeDays,
      }
    })(),
  }

  return env
}
