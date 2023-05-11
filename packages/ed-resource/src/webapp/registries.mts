import type { AddonItem } from '@moodlenet/component-library'
import type { GuestRegistryMap } from '@moodlenet/react-app/webapp'
import { useCreateRegistry } from '@moodlenet/react-app/webapp'

export type ResourcePageGeneralActionsRegItem = Pick<AddonItem, 'Item'>

export type EdResourceRegistries = ReturnType<typeof useMakeRegistries>
export type GuestMainRegistries = GuestRegistryMap<EdResourceRegistries>
export function useMakeRegistries() {
  const resourcePageGeneralActions = useCreateRegistry<ResourcePageGeneralActionsRegItem>()
  return {
    resourcePageGeneralActions,
  }
}
