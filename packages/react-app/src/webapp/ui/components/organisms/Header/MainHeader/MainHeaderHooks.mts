import { useContext, useMemo } from 'react'
import { AuthCtx } from '../../../../../web-lib.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { href } from '../../../elements/link.js'
import { MainHeaderProps } from './MainHeader.js'

export const useHeaderProps = (): MainHeaderProps => {
  const { clientSessionData } = useContext(AuthCtx)
  const headerTitleProps = useHeaderTitleProps()
  const isAuthenticated = !!clientSessionData
  const avatarUrl = clientSessionData?.userDisplay.avatarUrl
  const mainHeaderProps = useMemo<MainHeaderProps>(() => {
    return {
      headerTitleProps,
      accessButtonsProps: {
        //TODO: those access hrefs must be centralized in AuthCtx (present also in MinimalisticHeaderHooke)
        loginHref: href('/login'),
        signupHref: href('/signup'),
      },
      addMenuProps: {
        newCollectionHref: href('.'),
        newResourceHref: href('.'),
      },
      avatarMenuProps: {
        menuItems: [], //TODO: needs a registry
        avatarUrl,
      },
      isAuthenticated,
      centerItems: [], //TODO: needs a registry,
      leftItems: [], //TODO: needs a registry,
      rightItems: [], //TODO: needs a registry
    }
  }, [avatarUrl, headerTitleProps, isAuthenticated])
  return mainHeaderProps
}
