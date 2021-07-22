import { t, Trans } from '@lingui/macro'
import addIcon from '../../assets/icons/add.svg'
import { Href, Link } from '../../elements/link'
import { withCtrl } from '../../lib/ctrl'
import { Organization } from '../../types'
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
    logout?: () => unknown
    username: string
    myProfileHref: Href
  }
}
export type HeaderPropsLoading = HeaderPropsBase & {
  status: 'loading'
}

export type HeaderPropsBase = {
  homeHref: Href
  loginHref: Href
  setSearchText(text: string): unknown
  searchText: string
}
export type HeaderProps = HeaderPropsIdle | HeaderPropsLoading

export const Header = withCtrl<HeaderProps>(props => {
  const { homeHref, loginHref, searchText, setSearchText } = props
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
        <div className="right">
          <Searchbox setSearchText={setSearchText} searchText={searchText} placeholder={t`Search for anything!`} />
          {me ? (
            <>
              <img className="add-icon" src={addIcon} alt="Add" />
              <Link href={me.myProfileHref}>
                <img className="avatar" src={me.avatar} alt="Avatar" />
              </Link>
            </>
          ) : (
            <>
              <Link href={loginHref}>
                <div className="signin-btn">
                  <PrimaryButton>
                    <Trans>Sign in</Trans>
                  </PrimaryButton>
                </div>
              </Link>
              <div className="signup-btn">
                <TertiaryButton>
                  <Trans>Join now</Trans>
                </TertiaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
})
export default Header
