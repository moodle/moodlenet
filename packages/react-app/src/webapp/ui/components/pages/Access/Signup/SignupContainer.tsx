import { FC } from 'react'
import { Signup } from './Signup.js'
import { useSignUpProps } from './SignupHook.mjs'

export const SignUpContainer: FC = () => {
  const myProps = useSignUpProps()
  return <Signup {...myProps} />
}
