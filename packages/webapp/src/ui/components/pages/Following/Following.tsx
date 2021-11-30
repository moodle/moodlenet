import { CP, withCtrl } from '../../../lib/ctrl'
import { Browser, BrowserProps } from '../../organisms/Browser/Browser'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import './styles.scss'

export type FollowingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
}
export const Following = withCtrl<FollowingProps>(
  ({ headerPageTemplateProps, browserProps }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Browser {...browserProps} />
      </HeaderPageTemplate>
    )
  }
)
Following.displayName = 'FollowingPage'
