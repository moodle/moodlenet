import { t, Trans } from '@lingui/macro'
import { ChangeEventHandler, useCallback } from 'react'
import addIcon from '../../assets/icons/add.svg'
import searchIcon from '../../assets/icons/search.svg'
import { Href, Link } from '../../elements/link'
import { withCtrl } from '../../lib/ctrl'
import { Organization } from '../../types'
import PrimaryButton from '../atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../atoms/TertiaryButton/TertiaryButton'
import './styles.scss'

export type HeaderPropsIdle = HeaderPropsBase & {
  status: 'idle'
  organization: Pick<Organization, 'logo' | 'name' | 'url'>
  me: null | {
    avatar: string
    logout?: () => unknown
    username: string
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
  const setSearchTextCB = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => setSearchText(ev.currentTarget.value),
    [setSearchText],
  )
  if (props.status === 'loading') {
    return null
  }
  const { me, organization } = props
  return (
    <div className="header">
      <div className="content">
        <div className="left">
          <a href={organization.url} rel="noopener noreferrer" target="_blank">
            <img className="logo" src={organization.logo} alt="Logo" />
          </a>
          <Link href={homeHref}>
            <div className="text">MoodleNet</div>
          </Link>
        </div>
        <div className="right">
          <img className="big-search-icon" src={searchIcon} alt="Search" />
          <div className="search-box">
            <img className="search-icon" src={searchIcon} alt="Search" />
            <input
              className="search-text"
              placeholder={t`Search for anything!`}
              autoFocus={!!searchText}
              defaultValue={searchText}
              onChange={setSearchTextCB}
            />
          </div>
          {me ? (
            <>
              <img className="add-icon" src={addIcon} alt="Add" />
              <img className="avatar" src={me.avatar} alt="Avatar" />
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
