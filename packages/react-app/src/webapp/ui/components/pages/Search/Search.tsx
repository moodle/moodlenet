import type { FC } from 'react'
import type { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
import type { BrowserProps } from '../../organisms/Browser/Browser.js'
import Browser from '../../organisms/Browser/Browser.js'
import './Search.scss'

export type SearchProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserProps
}
export const Search: FC<SearchProps> = ({ mainLayoutProps, browserProps }) => {
  // const props = useMemo(() => browserProps, [browserProps])
  // console.log('browserProps', props)

  return (
    <MainLayout {...mainLayoutProps}>
      <div className="search">
        <Browser {...browserProps} />
      </div>
    </MainLayout>
  )
}
Search.displayName = 'SearchPage'
