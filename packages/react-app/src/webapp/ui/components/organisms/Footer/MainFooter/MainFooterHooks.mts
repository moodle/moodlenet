import type { AddonItem } from '@moodlenet/component-library'
import { useMemo } from 'react'
import { createHookPlugin } from '../../../../../web-lib/plugins.mjs'
import type { MainFooterProps } from './MainFooter.js'
export type FooterComponentRegItem = Omit<AddonItem, 'key'>

export const FooterPlugins = createHookPlugin<{
  leftComponent: FooterComponentRegItem
  centerComponent: FooterComponentRegItem
  rightComponent: FooterComponentRegItem
}>({ centerComponent: null, leftComponent: null, rightComponent: null })

export const useFooterProps = (): MainFooterProps => {
  const [addons] = FooterPlugins.useHookPlugin()

  const mainFooterProps = useMemo<MainFooterProps>(() => {
    const mainFooterProps: MainFooterProps = {
      leftItems: addons.leftComponent,
      centerItems: addons.centerComponent,
      rightItems: addons.rightComponent,
    }
    return mainFooterProps
  }, [addons.leftComponent, addons.centerComponent, addons.rightComponent])
  return mainFooterProps
}
