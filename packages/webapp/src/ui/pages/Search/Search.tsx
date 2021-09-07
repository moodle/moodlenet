import { Browser, BrowserProps } from '../../components/Browser/Browser'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import { useTitle } from '../commons'
import './styles.scss'

export type SearchProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  browserProps: BrowserProps
  searchedText: string
}
export const Search = withCtrl<SearchProps>(
  ({ headerPageTemplateProps, browserProps, searchedText}) => {
    useTitle('"' + searchedText + '" | MoodleNet')
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <Browser {...browserProps}/>
      </HeaderPageTemplate>
    )
  },
)
Search.displayName = 'SearchPage'
