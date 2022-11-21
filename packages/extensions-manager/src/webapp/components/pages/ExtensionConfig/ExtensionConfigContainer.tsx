import { FC } from 'react'
import { ExtensionType } from '../Extensions/Extensions.js'
import { useExtensionsConfigHooks } from './ExtensionsConfigHooks.js'
import './ExtensionConfig.scss'
import ExtensionConfig from './ExtensionConfig.js'

export type ExtensionConfigProps = {
  // configuration? : AddonItem
  extension: ExtensionType
  // onClickBackBtn?(arg0?: unknown): unknown | any
}

export const ExtensionConfigContainer: FC = () => {
  const extensionProps = useExtensionsConfigHooks()

  return <ExtensionConfig {...extensionProps} />
}
