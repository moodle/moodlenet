'use server'

import { redirect } from 'next/navigation'
import { signupFormValues } from './moodle-simple-email-access-signup.common'

export async function signup(signupFormValues: signupFormValues) {
  console.log({ signupFormValues })
  // revalidatePath('/signup')
  redirect('/')
}
