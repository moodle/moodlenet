import { HeaderProps, MinimalisticHeaderProps } from '@moodlenet/component-library'
import { useHeaderTitleProps } from './HeaderTitleHooks.js'

export const useHeaderProps = (): HeaderProps => {
  // usa i server
  // usa i context
  // ritorna HeaderProps
  return {
    headerTitleProps: useHeaderTitleProps(),
  }
}

export const useMinimalisticHeaderProps = (): MinimalisticHeaderProps => {
  // usa i server
  // usa i context
  // ritorna HeaderProps
  return {
    headerTitleProps: useHeaderTitleProps(),
    page: 'activation', // FIXME: ask to bru wich param
  }
}
