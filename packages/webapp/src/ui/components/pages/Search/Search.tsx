import { CP, withCtrl } from '../../../lib/ctrl'
import { Browser, BrowserProps } from '../../organisms/Browser/Browser'
import {
  HeaderPageTemplate,
  HeaderPageTemplateProps,
} from '../../templates/HeaderPageTemplate'
import './styles.scss'

export type SearchProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
}
export const Search = withCtrl<SearchProps>(
  ({ headerPageTemplateProps, browserProps }) => {
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Browser {...browserProps} />
      </HeaderPageTemplate>
    )
  }
)
Search.displayName = 'SearchPage'
