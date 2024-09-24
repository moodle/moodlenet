import type { BrowserPropsData, MainLayoutProps } from '@moodlenet/react-app/ui'
import { Browser, MainLayout } from '@moodlenet/react-app/ui'
import type { FC } from 'react'

export type FollowersProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserPropsData
  profileName: string
  isCreator: boolean
}
export const Followers: FC<FollowersProps> = ({
  mainLayoutProps,
  browserProps,
  profileName,
  isCreator,
}) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="followers">
        <Browser
          {...browserProps}
          title={isCreator ? `My followers` : `${profileName}${`'s followers`}`}
          showFilters={false}
        />
      </div>
    </MainLayout>
  )
}
Followers.displayName = 'FollowersPage'
