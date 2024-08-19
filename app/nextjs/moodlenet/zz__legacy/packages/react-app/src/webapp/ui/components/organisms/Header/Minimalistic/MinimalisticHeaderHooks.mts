import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { useMemo } from 'react'
import { createPlugin } from '../../../../../web-lib/create-plugin.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import type { MinimalisticHeaderProps } from './MinimalisticHeader.js'

export type MimimalisticHeaderPlugin = {
  centerItems?: AddOnMap<AddonItemNoKey>
  leftItems?: AddOnMap<AddonItemNoKey>
  rightItems?: AddOnMap<AddonItemNoKey>
}

export const MimimalisticHeaderHookPlugin = createPlugin<MimimalisticHeaderPlugin>()

export const useMinimalisticHeaderProps = (): MinimalisticHeaderProps => {
  const plugins = MimimalisticHeaderHookPlugin.usePluginHooks()
  const headerTitleProps = useHeaderTitleProps()
  const minimalisticHeaderProps = useMemo<MinimalisticHeaderProps>(() => {
    const minimalisticHeaderProps: MinimalisticHeaderProps = {
      headerTitleProps,
      centerItems: plugins.getKeyedAddons('centerItems'),
      leftItems: plugins.getKeyedAddons('leftItems'),
      rightItems: plugins.getKeyedAddons('rightItems'),
    }
    return minimalisticHeaderProps
  }, [headerTitleProps, plugins])

  return minimalisticHeaderProps
}
