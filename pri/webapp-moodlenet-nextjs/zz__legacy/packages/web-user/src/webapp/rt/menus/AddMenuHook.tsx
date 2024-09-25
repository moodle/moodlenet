import { CollectionContext } from '@moodlenet/collection/webapp'
import type { AddOnMap } from '@moodlenet/core/lib'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { createPlugin } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import type { AddMenuItem, AddMenuProps } from '../../ui/exports/ui.mjs'
import { AuthCtx } from '../context/AuthContext'

export type AddMenuPluginItem = Omit<AddMenuItem, 'key'>

export const AddMenuPlugins = createPlugin<{
  menuItems: AddOnMap<AddMenuPluginItem>
}>()

export function useAddMenuProps(): AddMenuProps {
  const resourceCtx = useContext(ResourceContext)
  const collectionCtx = useContext(CollectionContext)
  const { isAuthenticated } = useContext(AuthCtx)
  const plugins = AddMenuPlugins.usePluginHooks()
  const menuItems = useMemo<AddMenuItem[]>(
    () => (isAuthenticated ? plugins.getKeyedAddons('menuItems') : []),
    [plugins, isAuthenticated],
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
