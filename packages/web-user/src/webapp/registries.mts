import type { GuestRegistryMap } from '@moodlenet/react-app/webapp'
import { useCreateRegistry } from '@moodlenet/react-app/webapp'
import type {
  AvatarMenuItemRegItem,
  LoginEntryItem,
  SignupEntryItem,
} from './context/AuthContext.js'
import type { AddMenuItem } from './exports/ui.mjs'

export type AddMenuItemRegItem = Omit<AddMenuItem, 'key'>
export type MainRegistries = ReturnType<typeof useMakeRegistries>
export type GuestMainRegistries = GuestRegistryMap<MainRegistries>
export function useMakeRegistries() {
  const loginItems = useCreateRegistry<LoginEntryItem>()
  const signupItems = useCreateRegistry<SignupEntryItem>()
  const avatarMenuItems = useCreateRegistry<AvatarMenuItemRegItem>()
  const addMenuItems = useCreateRegistry<AddMenuItemRegItem>()

  return {
    loginItems,
    signupItems,
    avatarMenuItems,
    addMenuItems,
  }
}
