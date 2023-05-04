import type { FC } from 'react'
import type { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
import type { BrowserProps } from '../../organisms/Browser/Browser.js'
import Browser from '../../organisms/Browser/Browser.js'

export type BookmarksProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserProps
}
export const Bookmarks: FC<BookmarksProps> = ({ mainLayoutProps, browserProps }) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="bookmarks">
        <Browser {...browserProps} />
      </div>
    </MainLayout>
  )
}
Bookmarks.displayName = 'BookmarksPage'
