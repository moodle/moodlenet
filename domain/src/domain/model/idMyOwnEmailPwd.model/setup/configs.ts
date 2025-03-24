import { time_duration_string_schema } from '@moodle/lib-types'
import { idMyOwnEmailPwdConfigs } from '../types'

export const DEFAULT_ID_CONFIRMED_EMAIL_CONFIGS: idMyOwnEmailPwdConfigs = {
  emailConfirmationTokenExpires: time_duration_string_schema.parse('P1D'),
}
