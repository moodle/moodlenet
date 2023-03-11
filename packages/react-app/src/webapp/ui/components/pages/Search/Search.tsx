import { FC } from 'react'
import MainLayout, { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import { Browser, BrowserProps } from '../../organisms/Browser/Browser.js'
import './Search.scss'

export type SearchProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserProps
}
export const Search: FC<SearchProps> = ({ mainLayoutProps, browserProps }) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <Browser {...browserProps} />
    </MainLayout>
  )
}
Search.displayName = 'SearchPage'
