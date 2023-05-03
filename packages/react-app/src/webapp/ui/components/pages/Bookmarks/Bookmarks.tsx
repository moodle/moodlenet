import { FC } from 'react'
import MainLayout, { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import Browser, { BrowserProps } from '../../organisms/Browser/Browser.js'

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
