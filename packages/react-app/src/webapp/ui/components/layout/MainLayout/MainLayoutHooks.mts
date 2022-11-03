import { useHeaderProps } from '../Headers/HeaderHooks.mjs'
import { MainLayoutProps } from './MainLayout.js'

export const useMainLayoutProps = (): MainLayoutProps => {
  // usa i server
  // usa i context
  // ritorna MainLayoutProps
  return {
    headerProps: useHeaderProps(),
  }
}
