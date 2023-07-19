import type { AddOnMap } from '@moodlenet/core/lib'
import type { MainColumItem } from '@moodlenet/react-app/ui'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { FollowingProps } from '../../../ui/exports/ui.mjs'

export type BrowserPluginItem = Omit<MainColumItem, 'key'>
export const FollowingPagePlugin = createPlugin<{
  browserItems: AddOnMap<BrowserPluginItem>
}>()

export function useFollowsPageProps(): FollowingProps {
  const mainLayoutProps = useMainLayoutProps()
  const plugins = FollowingPagePlugin.usePluginHooks()

  const followsProps = useMemo<FollowingProps>(() => {
    const props: FollowingProps = {
      browserProps: { mainColumnItems: plugins.getKeyedAddons('browserItems') },
      mainLayoutProps,
    }
    return props
  }, [plugins, mainLayoutProps])
  return followsProps
}
