import type { BrowserPropsData, MainLayoutProps } from '@moodlenet/react-app/ui'
import { Browser, MainLayout } from '@moodlenet/react-app/ui'
import type { FC } from 'react'

export type FollowingProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserPropsData
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
