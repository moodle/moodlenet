import { useMinimalisticHeaderProps } from '../../../layout/Headers/HeaderHooks.mjs'
import { RootLoginProps } from './RootLogin.js'

export const useRootLoginProps = (): RootLoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  return { headerProps }
}
