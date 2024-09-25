import { email_address_schema } from '@moodle/lib-types'
import { object } from 'zod'

export const recoverPasswordRequestSchema = object({ email: email_address_schema })
