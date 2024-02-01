import type { BrowserPropsData, MainLayoutProps } from '@moodlenet/react-app/ui'
import { Browser, MainLayout } from '@moodlenet/react-app/ui'
import type { FC } from 'react'

export type FollowingProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserPropsData
  profileName: string
  isCreator: boolean
}
export const Following: FC<FollowingProps> = ({
  mainLayoutProps,
  browserProps,
  profileName,
  isCreator,
}) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="Following">
        <Browser
          {...browserProps}
          title={isCreator ? `Following` : `${profileName}${`'s following`}`}
          showFilters={false}
        />
      </div>
    </MainLayout>
  )
}
Following.displayName = 'FollowingPage'
