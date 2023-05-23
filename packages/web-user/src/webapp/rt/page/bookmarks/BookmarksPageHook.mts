import { MainColumItem } from '@moodlenet/react-app/ui'
import { createHookPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { BookmarksProps } from '../../../ui/exports/ui.mjs'

export type BrowserPluginItem = Omit<MainColumItem, 'key'>
export const BookmarksPagePlugin = createHookPlugin<{
  browserItems: BrowserPluginItem
}>({ browserItems: null })

export function useBookmarksPageProps(): BookmarksProps {
  const mainLayoutProps = useMainLayoutProps()
  const [{ browserItems }] = BookmarksPagePlugin.useHookPlugin()

  const bookmarksProps = useMemo<BookmarksProps>(() => {
    const props: BookmarksProps = {
      browserProps: { mainColumnItems: browserItems },
      mainLayoutProps,
    }
    return props
  }, [browserItems, mainLayoutProps])
  return bookmarksProps
}
