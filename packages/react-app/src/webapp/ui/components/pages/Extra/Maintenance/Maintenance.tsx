import type { FC } from 'react'
import { ReactComponent as HatLogo } from '../../../../assets/icons/hat-moodle.svg'
import type { MainLayoutProps } from '../../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../../layout/MainLayout/MainLayout.js'
import './styles.scss'

export type MaintenanceProps = {
  mainLayoutProps: MainLayoutProps
  // headerPageTemplateProps: CP<HeaderPageTemplateProps>
  // headerTitleProps: HeaderTitleProps
}

export const Maintenance: FC<MaintenanceProps> = ({ mainLayoutProps }) => (
  <MainLayout {...mainLayoutProps} /* hideHeader={true} */>
    <div className="maintenance-page">
      {/* <HeaderTitle
            {...headerTitleProps}
            homeHref={{
              url: 'https://docs.moodle.org/dev/MoodleNet',
              ext: true,
            }}
          /> */}
      <div className="content">
        <div className="title">{`We'll be back soon`}</div>
        <div className="subtitle">
          MoodleNet is down for a scheduled maintenance and expect to be online in a few minutes
        </div>
      </div>
      <div className="hat-logo">
        <HatLogo />
      </div>
    </div>
  </MainLayout>
)

Maintenance.defaultProps = {}
