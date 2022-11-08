import { useHeaderProps } from '../../organisms/Header/MainHeader/MainHeaderHooks.mjs'
import { MainLayoutProps } from './MainLayout.js'

export const useMainLayoutProps = (): MainLayoutProps => {
  return {
    headerProps: useHeaderProps(),
  }
}
