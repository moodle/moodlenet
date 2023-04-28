import { CollectionContext } from '@moodlenet/collection/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import { AddMenuItem, AddMenuProps } from './AddMenu.js'
import { CreateCollectionAddMenuItem, CreateResourceAddMenuItem } from './AddMenuItems.js'

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
        Component: () => (
          <CreateResourceAddMenuItem
            createResource={() => {
              resourceCtx.create().then(({ homePath }) => nav(homePath))
            }}
          />
        ),

        key: 'new ResourceIdx',
      },
      {
        Component: () => (
          <CreateCollectionAddMenuItem
            createCollection={() => {
              collectionCtx.create().then(({ homePath }) => nav(homePath))
            }}
          />
        ),

        key: 'new CollectionIdx',
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
