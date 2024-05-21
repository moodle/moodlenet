import { defaultImageUploadMaxSize } from '@moodlenet/react-app/server'
import type { ValidationsConfig } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { shell } from './shell.mjs'

type Env = {
  noBgProc: boolean
  deleteInactiveUsers:
    | false
    | {
        afterNoVisitsForDays: number
        notifyBeforeDays: number
        dayMs: number
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
      const __DO_DOWNSCALE_TIME__ =
        shell.isDevEnv && config.deleteInactiveUsers.__downscaleDaysToMinutes === true

      const minutesMs = 60 * 1000
      const dayMs = 24 * 60 * minutesMs
      const afterNoVisitsForDays = Math.floor(config.deleteInactiveUsers.afterNoVisitsForDays)
      const notifyBeforeDays = Math.floor(config.deleteInactiveUsers.notifyBeforeDays)
      if (!afterNoVisitsForDays || !notifyBeforeDays) {
        throw new Error(
          `deleteInactiveUsers config is invalid :${JSON.stringify(config.deleteInactiveUsers)}`,
        )
      }
      return {
        afterNoVisitsForDays,
        notifyBeforeDays,
        dayMs: __DO_DOWNSCALE_TIME__ ? minutesMs : dayMs,
      }
    })(),
  }

  return env
}
