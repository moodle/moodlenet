import { email_address_schema, map, url_string_schema } from '@moodle/lib-types'
import { object, string } from 'zod'

import { NodemailerSecEnv } from './types'

export type env_keys = 'MOODLE_SMTP_URL' | 'MOODLE_SMTP_SENDER_NAME' | 'MOODLE_SMTP_SENDER_ADDRESS'
export function provideEnv({
  env,
  logWarn = console.warn,
}: {
  env: map<unknown, env_keys>
  logWarn?: NodemailerSecEnv['logWarn']
}): NodemailerSecEnv {
  const env_config = object({
    MOODLE_SMTP_URL: url_string_schema,
    MOODLE_SMTP_SENDER_NAME: string().optional(),
    MOODLE_SMTP_SENDER_ADDRESS: email_address_schema,
  }).parse({
    MOODLE_SMTP_URL: env.MOODLE_SMTP_URL,
    MOODLE_SMTP_SENDER_NAME: env.MOODLE_SMTP_SENDER_NAME,
    MOODLE_SMTP_SENDER_ADDRESS: env.MOODLE_SMTP_SENDER_ADDRESS,
  })

  const nodemailerSecEnv: NodemailerSecEnv = {
    nodemailerTransport: env_config.MOODLE_SMTP_URL,
    sender: env_config.MOODLE_SMTP_SENDER_NAME
      ? {
          name: env_config.MOODLE_SMTP_SENDER_NAME,
          address: env_config.MOODLE_SMTP_SENDER_ADDRESS,
        }
      : env_config.MOODLE_SMTP_SENDER_ADDRESS,
    logWarn,
  }
  return nodemailerSecEnv
}
