import type { FC } from 'react'
import type { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
import type { BrowserPropsData } from '../../organisms/Browser/Browser.js'
import Browser from '../../organisms/Browser/Browser.js'

export type BookmarksProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserPropsData
}
export const Bookmarks: FC<BookmarksProps> = ({ mainLayoutProps, browserProps }) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="bookmarks">
        <Browser {...browserProps} title="Bookmarks" />
      </div>
    </MainLayout>
  )
}
Bookmarks.displayName = 'BookmarksPage'
