import { GuestRegistryMap, useCreateRegistry } from '@moodlenet/react-app/webapp'
import { LoginEntryItem, SignupEntryItem } from './context/AuthContext.js'
import { AddMenuItemRegItem } from './ui/components/organisms/HeaderProfile/AddMenu.js'
import { AvatarMenuItemRegItem } from './ui/components/organisms/HeaderProfile/AvatarMenu.js'

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
