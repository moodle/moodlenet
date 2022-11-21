import { SettingsItem } from '@moodlenet/react-app/ui'
import { FC } from 'react'
import { useInstallExtensionStoryProps } from '../InstallExtension/InstallExtension.stories.js'
import { useManageExtensionsStoryProps } from '../ManageExtensions/ManageExtensions.stories.js'

import Extensions, { ExtensionsMenu, ExtensionsProps } from './Extensions.js'

export const useExtensionsProps = (overrides?: {
  // editFormValues?: Partial<InstallExtensionData>
  props?: Partial<ExtensionsProps>
}): ExtensionsProps => {
  return {
    installExtensionProps: useInstallExtensionStoryProps(),
    manageExtensionsProps: useManageExtensionsStoryProps(),
    ...overrides?.props,
  }
}

export const ExtensionsItem: FC = () => <Extensions {...useExtensionsProps()} />

export const useElements = (): SettingsItem => {
  return {
    Menu: ExtensionsMenu,
    Content: {
      Item: ExtensionsItem,
      key: 'content-extensions',
    },
  }
}
