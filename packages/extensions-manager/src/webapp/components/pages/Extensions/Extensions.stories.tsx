import type { AdminSettingsItem } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useInstallExtensionStoryProps } from '../InstallExtension/InstallExtension.stories.js'
import { useManageExtensionsStoryProps } from '../ManageExtensions/ManageExtensions.stories.js'

import type { ExtensionsProps } from './Extensions.js'
import Extensions, { ExtensionsMenu } from './Extensions.js'

export const useExtensionsStoryProps = (overrides?: {
  // editFormValues?: Partial<InstallExtensionData>
  props?: Partial<ExtensionsProps>
}): ExtensionsProps => {
  return {
    installExtensionProps: useInstallExtensionStoryProps(),
    manageExtensionsProps: useManageExtensionsStoryProps(),
    ...overrides?.props,
  }
}

export const ExtensionsItem: FC = () => <Extensions {...useExtensionsStoryProps()} />

export const useElements = (): AdminSettingsItem => {
  return {
    Menu: ExtensionsMenu,
    Content: ExtensionsItem,
    key: 'content-extensions',
  }
}
