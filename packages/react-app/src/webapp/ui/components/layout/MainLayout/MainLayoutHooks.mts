import { useHeaderProps } from '../Headers/HeaderHooks.mjs'
import { MainLayoutProps } from './MainLayout.js'

export const useMainLayoutProps = (): MainLayoutProps => {
  return {
    headerProps: useHeaderProps(),
  }
}
