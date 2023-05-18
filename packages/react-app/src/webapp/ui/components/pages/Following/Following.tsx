import type { FC } from 'react'
import type { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
import type { BrowserProps } from '../../organisms/Browser/Browser.js'
import Browser from '../../organisms/Browser/Browser.js'

export type FollowingProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserProps
}
export const Following: FC<FollowingProps> = ({ mainLayoutProps, browserProps }) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="Following">
        <Browser {...browserProps} title="Following" />
      </div>
    </MainLayout>
  )
}
Following.displayName = 'FollowingPage'
