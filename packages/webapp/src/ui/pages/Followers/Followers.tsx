import { Browser, BrowserProps } from '../../components/Browser/Browser'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type FollowersProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
  displayName: string
}
export const Followers = withCtrl<FollowersProps>(({ headerPageTemplateProps, displayName, browserProps }) => {
  return (
    <HeaderPageTemplate {...headerPageTemplateProps}>
      <Browser {...browserProps } peopleTitle={`${displayName}'s followers`} />
    </HeaderPageTemplate>
  )
})
Followers.displayName = 'FollowersPage'
