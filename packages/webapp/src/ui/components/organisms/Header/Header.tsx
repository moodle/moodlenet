import { t, Trans } from '@lingui/macro'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import BookmarksIcon from '@material-ui/icons/Bookmarks'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import PersonIcon from '@material-ui/icons/Person'
import addIcon from '../../../assets/icons/add.svg'
import { ReactComponent as ArrowsIcon } from '../../../assets/icons/arrows.svg'
import { Href, Link } from '../../../elements/link'
import { withCtrl } from '../../../lib/ctrl'
import defaultAvatar from '../../../static/img/default-avatar.svg'
import { Organization } from '../../../types'
import FloatingMenu from '../../atoms/FloatingMenu/FloatingMenu'
import PrimaryButton from '../../atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../atoms/Searchbox/Searchbox'
import TertiaryButton from '../../atoms/TertiaryButton/TertiaryButton'
import HeaderTitle from './HeaderTitle/HeaderTitle'
import './styles.scss'

export type HeaderPropsIdle = HeaderPropsBase & {
  status: 'idle'
  organization: Pick<Organization, 'logo' | 'smallLogo' | 'url'>
  me: null | {
    avatar: string | null
    logout(): unknown
    name: string
    myProfileHref: Href
    bookmarksHref: Href
    followingHref: Href
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
  hideSearchbox?: boolean
  setSearchText(text: string): unknown
  searchText: string
  signUpHref: Href
}
export type HeaderProps = HeaderPropsIdle | HeaderPropsLoading

export const Header = withCtrl<HeaderProps>(props => {
  const {
    homeHref,
    loginHref,
    searchText,
    hideSearchbox,
    setSearchText,
    newCollectionHref,
    newResourceHref,
    signUpHref,
  } = props
  if (props.status === 'loading') {
    return null
  }
  const { me, organization } = props

  const avatar = {
    backgroundImage: 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
    backgroundSize: 'cover',
  }

  // console.log({ avatarUrl })
  return (
    <div className="header">
      <div className="content">
        <div className="left">
          <HeaderTitle organization={organization} homeHref={homeHref} />
        </div>
        <div className="center">
          {!hideSearchbox && (
            <Searchbox
              setSearchText={setSearchText}
              searchText={searchText}
              placeholder={t`Search for open educational content`}
            />
          )}
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
                    <Link href={me.bookmarksHref}>
                      <BookmarksIcon />
                      <Trans>Bookmarks</Trans>
                    </Link>
                    <Link href={me.followingHref}>
                      <ArrowsIcon />
                      <Trans>Following</Trans>
                    </Link>
                    <Link href={me.myProfileHref}>
                      <AccountCircleIcon />
                      <Trans>Profile</Trans>
                    </Link>
                    <Link onClick={me.logout} href={homeHref}>
                      <ExitToAppIcon />
                      <Trans>Log out</Trans>
                    </Link>
                  </div>
                }
                hoverElement={
                  <Link href={me.myProfileHref} style={avatar} className="avatar"/>
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
                        <Trans>Log in</Trans>
                      </Link>
                      <Link href={signUpHref}>
                        <Trans>Sign up</Trans>
                      </Link>
                    </div>
                  }
                  hoverElement={
                    <Link href={loginHref}>
                      <PrimaryButton>
                        <span>
                          <Trans>Log in</Trans>
                        </span>
                        <PersonIcon />
                      </PrimaryButton>
                    </Link>
                  }
                />
              </div>

              <div className="signup-btn">
                <Link href={signUpHref}>
                  <TertiaryButton>
                    <Trans>Join now</Trans>
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

Header.defaultProps = {
  hideSearchbox: false,
}

export default Header
