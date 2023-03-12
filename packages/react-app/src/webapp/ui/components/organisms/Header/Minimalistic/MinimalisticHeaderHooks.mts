import { useMemo } from 'react'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { href } from '../../../elements/link.js'
import { MinimalisticHeaderProps } from './MinimalisticHeader.js'

export const useMinimalisticHeaderProps = (): MinimalisticHeaderProps => {
  const headerTitleProps = useHeaderTitleProps()
  const minimalisticHeaderProps = useMemo<MinimalisticHeaderProps>(() => {
    return {
      headerTitleProps,
<<<<<<< Updated upstream
      page: 'activation', // FIXME //TODO BRU: ask to bru wich param
      //TODO ETTO: those access hrefs must be centralized in AuthCtx (present also in MainHeaderHooks)
=======
      page: 'activation', //TODO //@BRU: ask to bru wich param
      //TODO //@ETTO: those access hrefs must be centralized in AuthCtx (present also in MainHeaderHooks)
>>>>>>> Stashed changes
      loginHref: href('/login'),
      signupHref: href('/signup'),
      centerItems: [], //TODO ETTO: needs a registry,,
      leftItems: [], //TODO ETTO: needs a registry,,
      rightItems: [], //TODO ETTO: needs a registry,,
    }
  }, [headerTitleProps])

  return minimalisticHeaderProps
}
