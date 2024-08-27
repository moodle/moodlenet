'use server'

import { signupFormValues } from '@moodle/mod/eml-pwd-auth'
import { redirect } from 'next/navigation'

export async function signup(signupFormValues: signupFormValues) {
  console.log({ signupFormValues })
  // revalidatePath('/signup')
  redirect('/')
}
