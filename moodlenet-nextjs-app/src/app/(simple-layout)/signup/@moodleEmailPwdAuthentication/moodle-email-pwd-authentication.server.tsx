'use server'

import { redirect } from 'next/navigation'
import { signupFormValues } from './moodle-email-pwd-authentication.common'

export async function signup(signupFormValues: signupFormValues) {
  console.log({ signupFormValues })
  // revalidatePath('/signup')
  redirect('/')
}
