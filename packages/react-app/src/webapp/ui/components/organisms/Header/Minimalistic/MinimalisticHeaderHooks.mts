import { MinimalisticHeaderProps } from './MinimalisticHeader.js'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { href } from '../../../elements/link.js'
import { useMemo } from 'react'

export const useMinimalisticHeaderProps = (): MinimalisticHeaderProps => {
  const headerTitleProps = useHeaderTitleProps()
  const minimalisticHeaderProps = useMemo<MinimalisticHeaderProps>(() => {
    return {
      headerTitleProps,
      page: 'activation', // FIXME: ask to bru wich param
      //TODO: those access hrefs must be centralized in AuthCtx (present also in MainHeaderHooks)
      loginHref: href('/login'),
      signupHref: href('/signup'),
      centerItems: [], //TODO: needs a registry,,
      leftItems: [], //TODO: needs a registry,,
      rightItems: [], //TODO: needs a registry,,
    }
  }, [headerTitleProps])

  return minimalisticHeaderProps
}
