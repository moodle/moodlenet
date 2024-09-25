import type { FC } from 'react'
import Extensions from './Extensions'
import { useExtensionsProps } from './ExtensionsHooks'

export const ExtensionsContainer: FC = () => {
  const extensionsProps = useExtensionsProps()

  return <Extensions {...extensionsProps} />
}
