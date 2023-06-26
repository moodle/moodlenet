import type { ComponentType, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { createHookPlugin } from '../../../../web-lib/hook-plugin.mjs'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import type { MainColumItem } from '../../organisms/Browser/Browser.js'
import type { SearchProps } from './Search.js'
// import { useLocation } from 'react-router-dom'
// import { MainSearchBoxCtx } from '../../atoms/MainSearchBox/MainSearchBox.js'

export type SearchEntitySectionAddon = Omit<MainColumItem, 'key'>
export type SearchEntityPageWrapper = { Wrapper: ComponentType<PropsWithChildren<unknown>> }
export const SearchPagePlugin = createHookPlugin<{
  searchEntitySections: SearchEntitySectionAddon
  wrappers: SearchEntityPageWrapper
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
  // const { setSearchText } = useContext(MainSearchBoxCtx)
  // const { pathname } = useLocation()
  // useEffect(
  //   () => () => {
  //     setSearchText('')
  //   },
  //   [pathname, setSearchText],
  // )

  return { searchProps, wrappers: addons.wrappers }
}
