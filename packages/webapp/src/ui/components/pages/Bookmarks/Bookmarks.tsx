import { CP, withCtrl } from '../../../lib/ctrl'
import { Browser, BrowserProps } from '../../organisms/Browser/Browser'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import './styles.scss'

export type BookmarksProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
}
export const Bookmarks = withCtrl<BookmarksProps>(
  ({ headerPageTemplateProps, browserProps }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Browser {...browserProps} />
      </HeaderPageTemplate>
    )
  }
)
Bookmarks.displayName = 'BookmarksPage'
