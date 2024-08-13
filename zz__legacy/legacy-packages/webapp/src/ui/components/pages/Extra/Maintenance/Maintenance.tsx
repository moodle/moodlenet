import { Trans } from '@lingui/macro'
import { ReactComponent as HatLogo } from '../../../../assets/icons/hat-moodle.svg'
import { CP, withCtrl } from '../../../../lib/ctrl'
import HeaderTitle, {
  HeaderTitleProps,
} from '../../../organisms/Header/HeaderTitle/HeaderTitle'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../../templates/HeaderPageTemplate'
import './styles.scss'

export type MaintenanceProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  headerTitleProps: HeaderTitleProps
}

export const Maintenance = withCtrl<MaintenanceProps>(
  ({ headerPageTemplateProps, headerTitleProps }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps} hideHeader={true}>
        <div className="maintenance-page">
          <HeaderTitle
            {...headerTitleProps}
            homeHref={{
              url: 'https://docs.moodle.org/dev/MoodleNet',
              ext: true,
            }}
          />
          <div className="content">
            <div className="title">
              <Trans>We'll be back soon</Trans>
            </div>
            <div className="subtitle">
              <Trans>
                MoodleNet is down for a scheduled maintenance and expect to be
                online in a few minutes
              </Trans>
            </div>
          </div>
          <div className="hat-logo">
            <HatLogo />
          </div>
        </div>
      </HeaderPageTemplate>
    )
  }
)

Maintenance.defaultProps = {}
