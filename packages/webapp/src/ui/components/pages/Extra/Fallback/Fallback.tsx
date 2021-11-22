import { Trans } from '@lingui/macro'
import { ReactComponent as HatLogo } from '../../../../assets/icons/hat-moodle.svg'
import { CP, withCtrl } from '../../../../lib/ctrl'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../../templates/HeaderPageTemplate'
import './styles.scss'

export type FallbackProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
}

export const Fallback = withCtrl<FallbackProps>(
  ({ headerPageTemplateProps }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="fallback-page">
          <div className="content">
            <Trans>Page not found or access not allowed</Trans>
          </div>
          <div className="hat-logo">
            <HatLogo />
          </div>
        </div>
      </HeaderPageTemplate>
    )
  }
)

Fallback.defaultProps = {}
