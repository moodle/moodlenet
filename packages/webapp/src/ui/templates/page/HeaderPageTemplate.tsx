import { CP, withCtrl } from '../../lib/ctrl'
import HeaderPage, { HeaderPageProps } from '../../pages/HeaderPage/HeaderPage'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  headerPageProps: CP<HeaderPageProps>
  isAuthenticated: boolean
}

export const HeaderPageTemplate = withCtrl<HeaderPageTemplateProps>(
  ({ headerPageProps, isAuthenticated, children }) => {
    return (
      <MainPageWrapper>
        <HeaderPage {...headerPageProps} isAuthenticated={isAuthenticated} />
        <div className={`view ${isAuthenticated ? 'logged-in' : 'logged-out'}`}>{children}</div>
      </MainPageWrapper>
    )
  },
)
HeaderPageTemplate.displayName = 'HeaderPageTemplate'
