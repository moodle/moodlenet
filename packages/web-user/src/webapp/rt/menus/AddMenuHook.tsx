import { CollectionContext } from '@moodlenet/collection/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { createHookPlugin } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import type { AddMenuItem, AddMenuProps } from '../../ui/exports/ui.mjs'
import { AuthCtx } from '../context/AuthContext.js'

export type AddMenuPluginItem = Omit<AddMenuItem, 'key'>

export const AddMenuPlugins = createHookPlugin<{
  menuItems: AddMenuPluginItem
}>({ menuItems: null })

export function useAddMenuProps(): AddMenuProps {
  const resourceCtx = useContext(ResourceContext)
  const collectionCtx = useContext(CollectionContext)
  const { isAuthenticated } = useContext(AuthCtx)
  const [addons] = AddMenuPlugins.useHookPlugin()
  const menuItems = useMemo<AddMenuItem[]>(
    () => (isAuthenticated ? addons.menuItems : []),
    [addons.menuItems, isAuthenticated],
  )

  const addMenuProps = useMemo<AddMenuProps>(() => {
    const addMenuProps: AddMenuProps = {
      menuItems,
      createCollectionProps: {
        createCollection() {
          collectionCtx.createCollection()
        },
      },
      createResourceProps: {
        createResource() {
          resourceCtx.createResource()
        },
      },
    }
    return addMenuProps
  }, [collectionCtx, menuItems, resourceCtx])
  return addMenuProps
}
