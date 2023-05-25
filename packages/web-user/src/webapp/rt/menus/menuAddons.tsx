import { AddToCollectionButtonByResourceContextContainer as addResourceToCollectionButton } from '@moodlenet/collection/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddonsByUserRule } from '../init/AddonsByUserRule.js'
import { LoginButtonContainer, SignupButtonContainer } from '../page/access/AccessContainers.js'
import { UsersContainer, UsersMenu } from '../page/settings/UsersContainer.js'
import { AddMenuContainer } from './AddMenuContainer.js'
import { AvatarMenuContainer } from './AvatarMenuContainer.js'

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
  root: { addMenu: null, avatarMenu },
}

export const menuAddonsDefaultSetting = { default: { Content: UsersContainer, Menu: UsersMenu } }

export const resourcePageAddonsByAuth: AddonsByUserRule<AddonItemNoKey> = {
  guest: { addToCollectionButton: null },
  root: { addToCollectionButton: null },
  auth: { addToCollectionButton: { Item: addResourceToCollectionButton } },
}
