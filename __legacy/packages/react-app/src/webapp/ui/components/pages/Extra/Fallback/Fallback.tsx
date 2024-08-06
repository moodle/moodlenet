import type { FC } from 'react'
import { ReactComponent as HatLogo } from '../../../../assets/icons/hat-moodle.svg'
import type { MainLayoutProps } from '../../../../../../../../../../app-nextjs-moodlenet/src/app/MainLayout.js'
import MainLayout from '../../../../../../../../../../app-nextjs-moodlenet/src/app/MainLayout.js'
import './Fallback.scss'

export type FallbackProps = {
  mainLayoutProps: MainLayoutProps
}

export const Fallback: FC<FallbackProps> = ({ mainLayoutProps }) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="fallback-page">
        <div className="content">Page not found or access not allowed</div>
        <div className="hat-logo">
          <HatLogo />
        </div>
      </div>
    </MainLayout>
  )
}

Fallback.defaultProps = {}
