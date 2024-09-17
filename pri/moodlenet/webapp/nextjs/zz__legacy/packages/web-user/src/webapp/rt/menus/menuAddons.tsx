import { AddToCollectionButtonByResourceContextContainer as addResourceToCollectionButton } from '@moodlenet/collection/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddonsByUserRule } from '../lib/AddonsByUserRule'
import { LoginButtonContainer, SignupButtonContainer } from '../page/access/AccessContainers'
import {
  AdminModerationContainer,
  AdminModerationMenu,
} from '../page/admin/AdminModerationContainer'
import { AdminUsersContainer, AdminUsersMenu } from '../page/admin/AdminUsersContainer'
import { AddMenuContainer } from './AddMenuContainer'
import { AvatarMenuContainer } from './AvatarMenuContainer'

export const menuHeaderButtonsItems = {
  loginButton: { Item: LoginButtonContainer },
  signupButton: { Item: SignupButtonContainer },
  avatarMenu: { Item: AvatarMenuContainer },
  addMenu: { Item: AddMenuContainer },
}
const { loginButton, signupButton, avatarMenu, addMenu } = menuHeaderButtonsItems
export const menuHeaderButtonsAuthAddons: AddonsByUserRule<AddonItemNoKey> = {
  guest: { loginButton, signupButton },
  auth: { addMenu, avatarMenu },
  root: { addMenu: undefined, avatarMenu },
}

export const menuAddonsDefaultSetting = {
  default: { Content: AdminUsersContainer, Menu: AdminUsersMenu },
  aaa: { Content: AdminModerationContainer, Menu: AdminModerationMenu },
}

export const resourcePageAddonsByAuth: AddonsByUserRule<AddonItemNoKey> = {
  guest: { addToCollectionButton: undefined },
  root: { addToCollectionButton: undefined },
  auth: { addToCollectionButton: { Item: addResourceToCollectionButton } },
}
