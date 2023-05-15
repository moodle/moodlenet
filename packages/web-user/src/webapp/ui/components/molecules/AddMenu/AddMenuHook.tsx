import { CollectionContext } from '@moodlenet/collection/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { usePkgAddOns } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthCtx } from '../../../../context/AuthContext.js'
import type { AddMenuItem, AddMenuProps } from './AddMenu.js'

export type AddMenuPluginItem = Omit<AddMenuItem, 'key'>

export function useAddMenuProps(): AddMenuProps {
  const nav = useNavigate()
  const resourceCtx = useContext(ResourceContext)
  const collectionCtx = useContext(CollectionContext)
  const { isAuthenticated } = useContext(AuthCtx)
  const [addMenuItems /*,registerAddMenuItems */] = usePkgAddOns<AddMenuPluginItem>('AddMenuPlugin')
  const menuItems = useMemo<AddMenuItem[]>(() => {
    if (!isAuthenticated) {
      return []
    }
    return addMenuItems.map<AddMenuItem>(({ addOn: { Component, className }, key }) => {
      const addMenuItem: AddMenuItem = {
        Component,
        key,
        className,
      }
      return addMenuItem
    })
  }, [addMenuItems, isAuthenticated])

  const addMenuProps = useMemo<AddMenuProps>(() => {
    const addMenuProps: AddMenuProps = {
      menuItems,
      createCollectionProps: {
        createCollection() {
          collectionCtx.createCollection().then(({ homePath }) => nav(homePath))
        },
      },
      createResourceProps: {
        createResource() {
          resourceCtx.createResource().then(({ homePath }) => nav(homePath))
        },
      },
    }
    return addMenuProps
  }, [collectionCtx, menuItems, nav, resourceCtx])
  return addMenuProps
}
