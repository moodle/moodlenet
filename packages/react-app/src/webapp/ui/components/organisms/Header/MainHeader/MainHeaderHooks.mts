import { AddonItem } from '@moodlenet/component-library'
import { useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { AuthCtx } from '../../../../../web-lib.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { href } from '../../../elements/link.js'
import { HeaderMenuItem } from '../addons.js'
import { MainHeaderProps } from './MainHeader.js'
// import ExitToApp from '@material-ui/icons'

/*
   Icon: <Icon icon={'avatar'} />,
  className: 'avatar',
  position: 1,
  path: href('Pages/Profile/Logged In'),
  key: '1'
}*/

export const useHeaderProps = (): MainHeaderProps => {
  const { clientSessionData, logout } = useContext(AuthCtx)
  const { reg } = useContext(MainContext)
  const headerTitleProps = useHeaderTitleProps()
  const isAuthenticated = !!clientSessionData
  const avatarUrl = clientSessionData?.userDisplay.avatarUrl
  const avatarMenuReg = reg.avatarMenuItems
  const rightItemsReg = reg.rightComponents

  // prendo i valori dal registry inseriti da webuser o da package esterni
  const menuItems = useMemo(() => {
    return [
      ...avatarMenuReg.registry.entries.map<HeaderMenuItem>((el, idx) => {
        return {
          Icon: el.item.Icon,
          text: el.item.Text,
          key: el.pkgId.name + idx,
          path: el.item.Path,
        }
      }),
      {
        Icon: 'Settings',
        text: 'Admin',
        key: 'SettingsIdx',
        path: href('/settings'),
      },
      {
        Icon: '',
        // Icon: ExitToApp,
        text: 'Log out',
        key: 'logOutIdx',
        onClick: logout,
      },
    ]
  }, [avatarMenuReg.registry.entries, logout])

  const rightItems = useMemo(() => {
    return rightItemsReg.registry.entries.map<AddonItem>(({ item, pkgId }, idx) => {
      return {
        Item: item.Component,
        key: `${pkgId.name}_${idx}`,
      }
    })
  }, [rightItemsReg.registry.entries])

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
      rightItems,
    }
  }, [avatarUrl, headerTitleProps, isAuthenticated, menuItems, rightItems])
  return mainHeaderProps
}
