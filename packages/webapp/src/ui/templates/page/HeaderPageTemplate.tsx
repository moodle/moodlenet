import { CP, withCtrl } from '../../lib/ctrl'
import HeaderPage, { HeaderPageProps } from '../../pages/HeaderPage/HeaderPage'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  headerPageProps: CP<HeaderPageProps>
  isAuthenticated: boolean
  showSubHeader?: boolean
}

export const HeaderPageTemplate = withCtrl<HeaderPageTemplateProps>(
  ({ headerPageProps, isAuthenticated, showSubHeader, children }) => {
    return (
      <MainPageWrapper>
        <HeaderPage {...headerPageProps} isAuthenticated={isAuthenticated} />
        <div className={`view ${isAuthenticated && showSubHeader ? 'double-header-page' : 'single-header-page'}`}>{children}</div>
      </MainPageWrapper>
    )
  },
)
HeaderPageTemplate.displayName = 'HeaderPageTemplate'
HeaderPageTemplate.defaultProps = {
  showSubHeader: true
}
