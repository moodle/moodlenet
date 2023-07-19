import type { AddOnMap } from '@moodlenet/core/lib'
import type { MainColumItem } from '@moodlenet/react-app/ui'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { BookmarksProps } from '../../../ui/exports/ui.mjs'

export type BrowserPluginItem = Omit<MainColumItem, 'key'>
export const BookmarksPagePlugin = createPlugin<{
  browserItems: AddOnMap<BrowserPluginItem>
}>()

export function useBookmarksPageProps(): BookmarksProps {
  const mainLayoutProps = useMainLayoutProps()
  const plugins = BookmarksPagePlugin.usePluginHooks()

  const bookmarksProps = useMemo<BookmarksProps>(() => {
    const props: BookmarksProps = {
      browserProps: { mainColumnItems: plugins.getKeyedAddons('browserItems') },
      mainLayoutProps,
    }
    return props
  }, [plugins, mainLayoutProps])
  return bookmarksProps
}
