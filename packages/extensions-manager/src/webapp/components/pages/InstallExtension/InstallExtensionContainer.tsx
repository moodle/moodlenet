import type { FC } from 'react'
import InstallExtension from './InstallExtension.js'
import { useInstallExtensionProps } from './InstallExtensionHook.js'

export const InstallExtensionContainer: FC = () => {
  const installExtensionPropsControlled = useInstallExtensionProps()
  return <InstallExtension {...installExtensionPropsControlled} />
}
