import Header, { HeaderProps } from '../../components/molecules/Header/Header'
import { SubHeaderProps } from '../../components/molecules/SubHeader/SubHeader'
import { CP, withCtrl } from '../../lib/ctrl'
import './styles.scss'

export type HeaderPageProps = {
  headerProps: CP<HeaderProps>
  subHeaderProps: SubHeaderProps
  isAuthenticated: boolean
  showSubHeader?: boolean
  hideSearchbox?: boolean
}

export const HeaderPage = withCtrl<HeaderPageProps>(
  ({
    headerProps,
    hideSearchbox,
    //subHeaderProps,
    //isAuthenticated ,
    //showSubHeader
  }) => {
    return (
      <div className="page-header">
        <Header {...headerProps} hideSearchbox={hideSearchbox} />
        {/*{ isAuthenticated && showSubHeader && <SubHeader {...subHeaderProps} />}*/}{' '}
        {/* Uncomment when Tags implemented*/}
      </div>
    )
  },
)
HeaderPage.displayName = 'HeaderPage'
HeaderPage.defaultProps = {
  showSubHeader: true,
}
export default HeaderPage
