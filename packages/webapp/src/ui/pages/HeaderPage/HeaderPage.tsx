import Header, { HeaderProps } from '../../components/Header/Header'
import { SubHeaderProps } from '../../components/SubHeader/SubHeader'
import { CP, withCtrl } from '../../lib/ctrl'
import './styles.scss'

export type HeaderPageProps = {
  headerProps: CP<HeaderProps>
  subHeaderProps: SubHeaderProps
  isAuthenticated: boolean
  showSubHeader?: boolean
  showSearchbox?: boolean
}

export const HeaderPage = withCtrl<HeaderPageProps>(({ 
  headerProps, 
  showSearchbox,
  //subHeaderProps, 
  //isAuthenticated ,
  //showSubHeader 
}) => {
  return (
    <div className="page-header">
      <Header {...headerProps} showSearchbox={showSearchbox} />
      {/*{ isAuthenticated && showSubHeader && <SubHeader {...subHeaderProps} />}*/} {/* Uncomment when Tags implemented*/}
    </div>
  )
})
HeaderPage.displayName = 'HeaderPage'
HeaderPage.defaultProps = {
  showSubHeader: true
}
export default HeaderPage

