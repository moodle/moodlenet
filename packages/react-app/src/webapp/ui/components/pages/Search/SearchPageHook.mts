import type { ComponentType, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { createHookPlugin } from '../../../../web-lib/plugins.mjs'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import type { MainColumItem } from '../../organisms/Browser/Browser.js'
import type { SearchProps } from './Search.js'

export type SearchEntitySectionAddon = Omit<MainColumItem, 'key'>
export const SearchPagePlugin = createHookPlugin<{
  searchEntitySections: SearchEntitySectionAddon
  wrappers: { Wrapper: ComponentType<PropsWithChildren> }
}>({ searchEntitySections: null, wrappers: null })

export function useSearchProps() {
  const [addons] = SearchPagePlugin.useHookPlugin()
  const mainLayoutProps = useMainLayoutProps()
  const searchProps = useMemo<SearchProps>(() => {
    const props: SearchProps = {
      browserProps: { mainColumnItems: addons.searchEntitySections },
      mainLayoutProps,
    }
    return props
  }, [addons.searchEntitySections, mainLayoutProps])
  return { searchProps, wrappers: addons.wrappers }
}
