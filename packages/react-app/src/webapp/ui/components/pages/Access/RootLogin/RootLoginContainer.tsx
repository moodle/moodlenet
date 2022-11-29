import { FC } from 'react'
import { RootLogin } from './RootLogin.js'
import { useRootLoginProps } from './RootLoginHook.mjs'

export const RootLoginContainer: FC = () => {
  const myProps = useRootLoginProps()
  return <RootLogin {...myProps} />
}
