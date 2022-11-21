import { ExtensionsProps } from '../Extensions/Extensions.js'
import { useInstallExtensionStoryProps } from '../InstallExtension/InstallExtension.stories.js'
import { useManageExtensionsStoryProps } from '../ManageExtensions/ManageExtensions.stories.js'
import { useManageExtensions } from '../ManageExtensions/ManageExtensionsHooks.js'
import { ExtensionInfoProps } from './ExtensionInfo.js'

export const useExtensionsInfoProps = (): ExtensionInfoProps => {
  const xxx = useManageExtensions()
  return {}
}
