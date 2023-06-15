import type { FC } from 'react'
import { RootLogin } from '../../../ui/exports/ui.mjs'
import { useRootLoginProps } from './RootLoginHook.mjs'

export const RootLoginContainer: FC = () => {
  const myProps = useRootLoginProps()
  return <RootLogin {...myProps} />
}
