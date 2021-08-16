import { t, Trans } from '@lingui/macro'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import PersonIcon from '@material-ui/icons/Person'
import addIcon from '../../assets/icons/add.svg'
import { Href, Link } from '../../elements/link'
import { withCtrl } from '../../lib/ctrl'
import { Organization } from '../../types'
import FloatingMenu from '../atoms/FloatingMenu/FloatingMenu'
import PrimaryButton from '../atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../atoms/Searchbox/Searchbox'
import TertiaryButton from '../atoms/TertiaryButton/TertiaryButton'
import HeaderTitle from './HeaderTitle/HeaderTitle'
import './styles.scss'

export type HeaderPropsIdle = HeaderPropsBase & {
  status: 'idle'
  organization: Pick<Organization, 'logo' | 'name' | 'url'>
  me: null | {
    avatar: string
    logout(): unknown
    name: string
    myProfileHref: Href
  }
}
export type HeaderPropsLoading = HeaderPropsBase & {
  status: 'loading'
}

export type HeaderPropsBase = {
  homeHref: Href
  loginHref: Href
  newResourceHref: Href
  newCollectionHref: Href
  setSearchText(text: string): unknown
  searchText: string
  signUpHref: Href
}
export type HeaderProps = HeaderPropsIdle | HeaderPropsLoading

export const Header = withCtrl<HeaderProps>(props => {
  const { homeHref, loginHref, searchText, setSearchText, newCollectionHref, newResourceHref, signUpHref } = props
  if (props.status === 'loading') {
    return null
  }
  const { me, organization } = props

  return (
    <div className="header">
      <div className="content">
        <div className="left">
          <HeaderTitle organization={organization} homeHref={homeHref} />
        </div>
        <div className="center">
          <Searchbox setSearchText={setSearchText} searchText={searchText} placeholder={t`Search for anything!`} />
        </div>
        <div className="right">
          {me ? (
            <>
              <FloatingMenu
                menuContent={
                  <div>
                    <Link href={newResourceHref}>
                      <NoteAddIcon />
                      <Trans>New Resource</Trans>
                    </Link>
                    <Link href={newCollectionHref}>
                      <LibraryAddIcon />
                      <Trans>New Collection</Trans>
                    </Link>
                  </div>
                }
                hoverElement={<img className="add-icon" src={addIcon} alt="Add" />}
              />
              <FloatingMenu
                menuContent={
                  <div>
                    <Link href={me.myProfileHref}>
                      <AccountCircleIcon />
                      <Trans>Profile</Trans>
                    </Link>
                    <Link onClick={me.logout} href={homeHref}>
                      <ExitToAppIcon />
                      <Trans>Logout</Trans>
                    </Link>
                  </div>
                }
                hoverElement={
                  <Link href={me.myProfileHref}>
                    <img className="avatar" src={me.avatar} alt="Avatar" />
                  </Link>
                }
              />
            </>
          ) : (
            <>
              <div className="signin-btn">
                <FloatingMenu
                  menuContent={
                    <div>
                      <Link href={loginHref}>
                        <Trans>Login</Trans>
                      </Link>
                      <Link href={signUpHref}>
                        <Trans>Sign Up</Trans>
                      </Link>
                    </div>
                  }
                  hoverElement={
                    <PrimaryButton>
                      <Link href={loginHref}>
                        <Trans>Login</Trans>
                      </Link>
                      <PersonIcon />
                    </PrimaryButton>
                  }
                />
              </div>

              <div className="signup-btn">
                <Link href={signUpHref}>
                  <TertiaryButton>
                    <Trans>Sign up</Trans>
                  </TertiaryButton>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
})
export default Header
