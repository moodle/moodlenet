import type { AddOnMap } from '@moodlenet/core/lib'
import type { ComponentType, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { createPlugin } from '../../../../web-lib/create-plugin.mjs'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import type { MainColumItem } from '../../organisms/Browser/Browser'
import type { SearchProps } from './Search'
// import { useLocation } from 'react-router-dom'
// import { MainSearchBoxCtx } from '../../atoms/MainSearchBox/MainSearchBox'

export type SearchEntitySectionAddon = Omit<MainColumItem, 'key'>
export type SearchEntityPageWrapper = { Wrapper: ComponentType<PropsWithChildren<unknown>> }
export const SearchPagePlugin = createPlugin<{
  searchEntitySections: AddOnMap<SearchEntitySectionAddon>
  wrappers: AddOnMap<SearchEntityPageWrapper>
}>()

export function useSearchProps() {
  const plugins = SearchPagePlugin.usePluginHooks()
  const mainLayoutProps = useMainLayoutProps()
  const searchProps = useMemo<SearchProps>(() => {
    const props: SearchProps = {
      browserProps: { mainColumnItems: plugins.getKeyedAddons('searchEntitySections') },
      mainLayoutProps,
    }
    return props
  }, [plugins, mainLayoutProps])
  // const { setSearchText } = useContext(MainSearchBoxCtx)
  // const { pathname } = useLocation()
  // useEffect(
  //   () => () => {
  //     setSearchText('')
  //   },
  //   [pathname, setSearchText],
  // )

  return { searchProps, wrappers: plugins.getKeyedAddons('wrappers') }
}
