import { useMemo } from 'react'
import { useInstallExtensionProps } from '../InstallExtension/InstallExtensionHook.js'
import { useManageExtensionsProps } from '../ManageExtensions/ManageExtensionsHooks.js'

import type { ExtensionsProps } from './Extensions.js'

export const useExtensionsProps = (): ExtensionsProps => {
  const installExtensionProps = useInstallExtensionProps()
  const manageExtensionsProps = useManageExtensionsProps()

  const extensionsProps = useMemo<ExtensionsProps>(() => {
    const props: ExtensionsProps = {
      installExtensionProps,
      manageExtensionsProps,
    }
    return props
  }, [installExtensionProps, manageExtensionsProps])

  return extensionsProps
}
