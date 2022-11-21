import { FC } from 'react'
import Extensions from './Extensions.js'
import { useExtensionsProps } from './ExtensionsHooks.js'

export const ExtensionsContainer: FC = () => {
  const panelProps = useExtensionsProps()

  return <Extensions {...panelProps} />
}
