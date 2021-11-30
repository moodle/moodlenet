import { CP, withCtrl } from '../../../lib/ctrl'
import Header, { HeaderProps } from '../../organisms/Header/Header'
// import { SubHeaderProps } from '../../organisms/SubHeader/SubHeader'
import './styles.scss'

export type HeaderPageProps = {
  headerProps: CP<HeaderProps>
  // subHeaderProps?: SubHeaderProps
  // isAuthenticated: boolean
  // showSubHeader?: boolean
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
  }
)
HeaderPage.displayName = 'HeaderPage'
HeaderPage.defaultProps = {}
export default HeaderPage
