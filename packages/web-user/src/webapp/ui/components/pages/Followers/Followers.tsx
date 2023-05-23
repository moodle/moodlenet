import type { BrowserPropsData, MainLayoutProps } from '@moodlenet/react-app/ui'
import { Browser, MainLayout } from '@moodlenet/react-app/ui'
import type { FC } from 'react'

export type FollowersProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserPropsData
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
