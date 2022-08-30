import { t } from '@lingui/macro'
import { CP, withCtrl } from '../../../lib/ctrl'
import { Browser, BrowserProps } from '../../organisms/Browser/Browser'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import './styles.scss'

export type FollowersProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
}
export const Followers = withCtrl<FollowersProps>(
  ({ headerPageTemplateProps, browserProps }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Browser {...browserProps} title={t`Followers`} />
      </HeaderPageTemplate>
    )
  }
)
Followers.displayName = 'FollowersPage'
