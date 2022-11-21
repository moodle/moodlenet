import { FC } from 'react'
import ExtensionInfo from './ExtensionInfo.js'
import { useExtensionsInfoProps } from './ExtensionInfoHook.js'

export const ExtensionsContainer: FC = () => {
  const panelProps = useExtensionsInfoProps()

  return <ExtensionInfo {...panelProps} />
}
