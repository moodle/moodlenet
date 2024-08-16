'use server'

import { redirect } from 'next/navigation'
import { loginFormValues } from './moodle-simple-email-access-login.common'

export async function login(loginFormValues: loginFormValues) {
  console.log({ loginFormValues })
  redirect('/')
}
