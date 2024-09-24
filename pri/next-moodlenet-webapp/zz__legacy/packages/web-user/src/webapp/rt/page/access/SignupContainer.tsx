import type { FC } from 'react'
import { Signup } from '../../../ui/exports/ui.mjs'
import { useSignUpProps } from './SignupHook.mjs'

export const SignUpContainer: FC = () => {
  const myProps = useSignUpProps()
  return <Signup {...myProps} />
}
