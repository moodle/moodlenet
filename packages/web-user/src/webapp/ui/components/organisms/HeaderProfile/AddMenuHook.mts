import { useContext, useMemo } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import { AddMenuItem, AddMenuProps } from './AddMenu.js'

export function useAddMenuProps(): AddMenuProps {
  const mainCtx = useContext(MainContext)
  const { isAuthenticated } = useContext(AuthCtx)

  const menuEntries = mainCtx.registries.addMenuItems.registry.entries
  const menuItems = useMemo<AddMenuItem[]>(() => {
    if (!isAuthenticated) {
      return []
    }
    const regAddMenuItems = menuEntries.map<AddMenuItem>(({ item, pkgId }, index) => {
      const addMenuItem: AddMenuItem = {
        ...item,
        key: `${pkgId.name}:${index}`,
      }
      return addMenuItem
    })

    const addMenuItems: AddMenuItem[] = [
      {
        Icon: '',
        // Icon: ExitToApp,
        text: 'new Resource',
        key: 'new ResourceIdx',
        onClick() {
          // create resource
        },
      },
      {
        Icon: '',
        // Icon: ExitToApp,
        text: 'new Collection',
        key: 'new CollectionIdx',
        onClick() {
          // create Collection
        },
      },
    ]

    return [...addMenuItems, ...regAddMenuItems]
  }, [isAuthenticated, menuEntries])

  const addMenuProps = useMemo<AddMenuProps>(() => {
    const addMenuProps: AddMenuProps = {
      menuItems,
    }
    return addMenuProps
  }, [menuItems])
  return addMenuProps
}
