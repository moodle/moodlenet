import { useMinimalisticHeaderProps } from '../Headers/HeaderHooks.mjs'
import { SimpleLayoutProps } from './SimpleLayout.js'

export const useSimpleLayoutProps = (): SimpleLayoutProps => {
  // usa i server
  // usa i context
  // ritorna useMainLayoutProps
  return {
    headerProps: useMinimalisticHeaderProps(),
    page: 'activation', // FIXME: ask to bru wich param
  }
}
