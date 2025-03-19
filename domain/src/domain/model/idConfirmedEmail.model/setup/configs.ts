import { time_duration_string_schema } from '@moodle/lib-types'
import { idConfirmedEmailConfigs } from '../types'

export const DEFAULT_ID_CONFIRMED_EMAIL_CONFIGS: idConfirmedEmailConfigs = {
  emailConfirmationTokenExpires: time_duration_string_schema.parse('P1D'),
}
