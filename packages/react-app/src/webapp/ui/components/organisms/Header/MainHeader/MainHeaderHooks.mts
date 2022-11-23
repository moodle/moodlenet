import { useContext, useMemo } from 'react'
import { avatarMenuItems } from '../../../../../registries.mjs'
import { AuthCtx } from '../../../../../web-lib.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { href } from '../../../elements/link.js'
import { HeaderMenuItem } from '../addons.js'
import { MainHeaderProps } from './MainHeader.js'

/*
   Icon: <Icon icon={'avatar'} />,
  className: 'avatar',
  position: 1,
  path: href('Pages/Profile/Logged In'),
  key: '1'
}*/

export const useHeaderProps = (): MainHeaderProps => {
  const { clientSessionData } = useContext(AuthCtx)
  const headerTitleProps = useHeaderTitleProps()
  const isAuthenticated = !!clientSessionData
  const avatarUrl = clientSessionData?.userDisplay.avatarUrl
  const avatarMenuReg = avatarMenuItems.useRegistry()

  // prendo i valori dal registry inseriti da webuser o da package esterni
  const menuItems = avatarMenuReg.registry.entries.map<HeaderMenuItem>((el, idx) => {
    return {
      Icon: el.item.Icon,
      text: el.item.Text,
      key: el.pkgId.name + idx,
      path: el.item.Path,
    }
  })

  menuItems.unshift({
    Icon: 'Settings',
    text: '',
    key: 'SettingsIdx',
    path: href('/settings'),
  })
  menuItems.unshift({
    Icon: '',
    text: 'LogOut',
    key: 'logOutIdx',
    path: href('/logout'),
  })

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
        menuItems,
        avatarUrl,
      },
      isAuthenticated,
      centerItems: [], //TODO: needs a registry,
      leftItems: [], //TODO: needs a registry,
      rightItems: [], //TODO: needs a registry
    }
  }, [avatarUrl, headerTitleProps, isAuthenticated, menuItems])
  return mainHeaderProps
}
