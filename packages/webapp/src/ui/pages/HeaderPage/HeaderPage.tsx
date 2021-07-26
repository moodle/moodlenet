import Header, { HeaderProps } from '../../components/Header/Header'
import SubHeader, { SubHeaderProps } from '../../components/SubHeader/SubHeader'
import { CP, withCtrl } from '../../lib/ctrl'
import './styles.scss'

export type HeaderPageProps = {
  headerProps: CP<HeaderProps>
  subHeaderProps: SubHeaderProps,
  isAuthenticated: boolean
  showSubHeader?: boolean
}

export const HeaderPage = withCtrl<HeaderPageProps>(({ 
  headerProps, 
  subHeaderProps, 
  isAuthenticated ,
  showSubHeader 
}) => {
  return (
    <div className="page-header">
      <Header {...headerProps} />
      { isAuthenticated && showSubHeader && <SubHeader {...subHeaderProps} />}
    </div>
  )
})
HeaderPage.displayName = 'HeaderPage'
HeaderPage.defaultProps = {
  showSubHeader: true
}
export default HeaderPage

