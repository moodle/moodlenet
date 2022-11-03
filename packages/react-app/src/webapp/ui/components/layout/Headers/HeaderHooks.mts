import { HeaderProps } from '@moodlenet/component-library'
import { useHeaderTitleProps } from './HeaderTitleHooks.js'

export const useHeaderProps = (): HeaderProps => {
  // usa i server
  // usa i context
  // ritorna HeaderProps
  return {
    headerTitleProps: useHeaderTitleProps(),
  }
}