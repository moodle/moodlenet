import type { MainColumItem } from '@moodlenet/react-app/ui'
import { createHookPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { FollowingProps } from '../../../ui/exports/ui.mjs'

export type BrowserPluginItem = Omit<MainColumItem, 'key'>
export const FollowingPagePlugin = createHookPlugin<{
  browserItems: BrowserPluginItem
}>({ browserItems: null })

export function useFollowsPageProps(): FollowingProps {
  const mainLayoutProps = useMainLayoutProps()
  const [{ browserItems }] = FollowingPagePlugin.useHookPlugin()

  const followsProps = useMemo<FollowingProps>(() => {
    const props: FollowingProps = {
      browserProps: { mainColumnItems: browserItems },
      mainLayoutProps,
    }
    return props
  }, [browserItems, mainLayoutProps])
  return followsProps
}
