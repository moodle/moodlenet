import { useMemo } from 'react'
// import { useInstallExtensionProps } from '../InstallExtension/InstallExtensionHook'
import { useManageExtensionsProps } from '../ManageExtensions/ManageExtensionsHooks'

import type { ExtensionsProps } from './Extensions'

export const useExtensionsProps = (): ExtensionsProps => {
  // const installExtensionProps = useInstallExtensionProps()
  const manageExtensionsProps = useManageExtensionsProps()

  const extensionsProps = useMemo<ExtensionsProps>(() => {
    const props: ExtensionsProps = {
      // installExtensionProps,
      manageExtensionsProps,
    }
    return props
  }, [manageExtensionsProps])

  return extensionsProps
}
