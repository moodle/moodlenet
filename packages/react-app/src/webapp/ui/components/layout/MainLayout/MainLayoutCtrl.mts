import { useHeaderProps } from '@moodlenet/component-library'
import { MainLayoutProps } from './MainLayout.js'

export const useMainLayoutProps = (): MainLayoutProps => {
  // usa i server
  // usa i context
  // ritorna MainLayoutProps
  return {
    headerProps: useHeaderProps(),
  }
}
