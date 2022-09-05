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
  profileName?: string
}
export const Followers = withCtrl<FollowersProps>(
  ({ headerPageTemplateProps, browserProps, profileName }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Browser
          {...browserProps}
          title={`${profileName}${t`'s followers`}`}
          hideSortAndFilter
        />
      </HeaderPageTemplate>
    )
  }
)
Followers.displayName = 'FollowersPage'
