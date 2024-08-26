import { object, string, ZodType } from 'zod'

export type loginFormValues = { email: string; password: string }
export interface loginFormConfigs {
  email: { max: number; min: number }
  password: { max: number; min: number }
}

export default function getSchema(configs: loginFormConfigs): ZodType<loginFormValues> {
  return object({
    email: string().email().min(configs.email.min).max(configs.email.max),
    password: string().min(configs.password.min).max(configs.password.max),
  })
}
