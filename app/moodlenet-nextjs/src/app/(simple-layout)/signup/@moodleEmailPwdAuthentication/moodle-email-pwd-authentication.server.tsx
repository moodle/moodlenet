'use server'

import { signupFormValues } from '@moodle/domain/mod/moodle/eml-pwd-auth'
import { redirect } from 'next/navigation'

export async function signup(signupFormValues: signupFormValues) {
  console.log({ signupFormValues })
  // revalidatePath('/signup')
  redirect('/')
}
