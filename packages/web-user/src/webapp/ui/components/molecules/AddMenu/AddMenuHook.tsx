import { CollectionContext } from '@moodlenet/collection/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import type { AddMenuItem, AddMenuProps } from './AddMenu.js'

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
    return menuEntries.map<AddMenuItem>(({ item, pkgId }, index) => {
      const addMenuItem: AddMenuItem = {
        ...item,
        key: `${pkgId.name}:${index}`,
      }
      return addMenuItem
    })
  }, [isAuthenticated, menuEntries])

  const addMenuProps = useMemo<AddMenuProps>(() => {
    const addMenuProps: AddMenuProps = {
      menuItems,
      createCollectionProps: {
        createCollection() {
          collectionCtx.create().then(({ homePath }) => nav(homePath))
        },
      },
      createResourceProps: {
        createResource() {
          resourceCtx.create().then(({ homePath }) => nav(homePath))
        },
      },
    }
    return addMenuProps
  }, [collectionCtx, menuItems, nav, resourceCtx])
  return addMenuProps
}
