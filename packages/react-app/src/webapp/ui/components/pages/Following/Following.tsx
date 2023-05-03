import { FC } from 'react'
import MainLayout, { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import Browser, { BrowserProps } from '../../organisms/Browser/Browser.js'

export type FollowingProps = {
  mainLayoutProps: MainLayoutProps
  browserProps: BrowserProps
}
export const Following: FC<FollowingProps> = ({ mainLayoutProps, browserProps }) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="Following">
        <Browser {...browserProps} />
      </div>
    </MainLayout>
  )
}
Following.displayName = 'FollowingPage'
