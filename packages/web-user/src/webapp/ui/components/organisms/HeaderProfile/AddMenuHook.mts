import { CollectionContext } from '@moodlenet/collection/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import { AddMenuItem, AddMenuProps } from './AddMenu.js'

export function useAddMenuProps(): AddMenuProps {
  const nav = useNavigate()
  const resourceCtx = useContext(ResourceContext)
  const collectionCtx = useContext(CollectionContext)
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
        async onClick() {
          const { homePath } = await resourceCtx.create()
          nav(homePath)
        },
      },
      {
        Icon: '',
        // Icon: ExitToApp,
        text: 'new Collection',
        key: 'new CollectionIdx',
        async onClick() {
          const { homePath } = await collectionCtx.create()
          nav(homePath)
        },
      },
    ]

    return [...addMenuItems, ...regAddMenuItems]
  }, [collectionCtx, isAuthenticated, menuEntries, nav, resourceCtx])

  const addMenuProps = useMemo<AddMenuProps>(() => {
    const addMenuProps: AddMenuProps = {
      menuItems,
    }
    return addMenuProps
  }, [menuItems])
  return addMenuProps
}
