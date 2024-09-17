import type { FC } from 'react'
import InstallExtension from './InstallExtension'
import { useInstallExtensionProps } from './InstallExtensionHook'

export const InstallExtensionContainer: FC = () => {
  const installExtensionPropsControlled = useInstallExtensionProps()
  return <InstallExtension {...installExtensionPropsControlled} />
}
