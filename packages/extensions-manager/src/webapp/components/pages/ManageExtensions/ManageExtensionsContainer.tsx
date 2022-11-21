import { FC } from 'react'
import Extensions from './ManageExtensions.js'
import { useExtensionsProps } from './ExtensionsHooks.js'

export const ManageExtensionsContainer: FC = () => {
  const panelProps = useExtensionsProps()

  return <Extensions {...panelProps} />
}
