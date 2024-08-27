import { object, string, ZodType } from 'zod'
export interface Configs {
  loginForm: loginFormConfigs
  signupForm: signupFormConfigs
}

export type loginFormValues = { email: string; password: string }
export interface loginFormConfigs {
  email: { max: number; min: number }
  password: { max: number; min: number }
}

export function getLoginFormSchema(configs: loginFormConfigs): ZodType<loginFormValues> {
  return object({
    email: string().email().min(configs.email.min).max(configs.email.max),
    password: string().min(configs.password.min).max(configs.password.max),
  })
}

export type signupFormValues = { email: string; password: string; displayName: string }
export interface signupFormConfigs {
  email: { max: number; min: number }
  password: { max: number; min: number }
  displayName: { max: number; min: number }
}
export function getSignupFormSchema(configs: signupFormConfigs): ZodType<signupFormValues> {
  return object({
    email: string().email().min(configs.email.min).max(configs.email.max),
    password: string().min(configs.password.min).max(configs.password.max),
    displayName: string().min(configs.displayName.min).max(configs.displayName.max),
  })
}
