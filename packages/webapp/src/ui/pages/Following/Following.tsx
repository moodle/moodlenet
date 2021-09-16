import { Browser, BrowserProps } from '../../components/Browser/Browser'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type FollowingProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
}
export const Following = withCtrl<FollowingProps>(({ headerPageTemplateProps, browserProps }) => {
  return (
    <HeaderPageTemplate {...headerPageTemplateProps}>
      <Browser {...browserProps} />
    </HeaderPageTemplate>
  )
})
Following.displayName = 'FollowingPage'
