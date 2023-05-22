import type { FC } from 'react'
import type { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
import type { BrowserProps } from '../../organisms/Browser/Browser.js'
import Browser from '../../organisms/Browser/Browser.js'

export type FollowersProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserProps
  profileName: string
}
export const Followers: FC<FollowersProps> = ({ mainLayoutProps, browserProps, profileName }) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="followers">
        <Browser {...browserProps} title={`${profileName}${`'s followers`}`} showFilters={false} />
      </div>
    </MainLayout>
  )
}
Followers.displayName = 'FollowersPage'
