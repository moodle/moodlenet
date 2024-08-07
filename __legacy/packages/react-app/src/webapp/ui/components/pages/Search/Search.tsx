import type { FC } from 'react'
import type { MainLayoutProps } from '../../../../../../../../../app-nextjs-moodlenet/src/layouts/MainLayout.js'
import MainLayout from '../../../../../../../../../app-nextjs-moodlenet/src/layouts/MainLayout.js'
import type { BrowserPropsData } from '../../organisms/Browser/Browser.js'
import Browser from '../../organisms/Browser/Browser.js'
import './Search.scss'

export type SearchProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserPropsData
}

export const Search: FC<SearchProps> = ({ mainLayoutProps, browserProps }) => {
  // const props = useMemo(() => browserProps, [browserProps])
  // console.log('browserProps', props)

  return (
    <MainLayout {...mainLayoutProps}>
      <div className="search">
        <Browser {...browserProps} showFilters />
      </div>
    </MainLayout>
  )
}
Search.displayName = 'SearchPage'
