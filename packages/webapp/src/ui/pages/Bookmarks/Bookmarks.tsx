import { Browser, BrowserProps } from '../../components/Browser/Browser'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type BookmarksProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
}
export const Bookmarks = withCtrl<BookmarksProps>(
  ({ headerPageTemplateProps, browserProps}) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Browser {...browserProps}/>
      </HeaderPageTemplate>
    )
  },
)
Bookmarks.displayName = 'BookmarksPage'
