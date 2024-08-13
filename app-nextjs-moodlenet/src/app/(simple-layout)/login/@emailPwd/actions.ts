'use server'

// import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type LoginFormValues = { email: string; password: string }
export async function login(loginFormValues: LoginFormValues) {
  console.log({ loginFormValues })
  // revalidatePath('/login')
  redirect('/')
}
