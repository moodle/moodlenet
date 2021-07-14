import { FC } from 'react'
import addIcon from '../../assets/icons/add.svg'
import searchIcon from '../../assets/icons/search.svg'
import { Organization } from '../../types'
import PrimaryButton from '../atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../atoms/TertiaryButton/TertiaryButton'
import './styles.scss'

export type HeaderProps =
  | {
      status: 'idle'
      organization: Pick<Organization, 'logo' | 'name' | 'url'>
      avatar: string
      homeLink: string
      loginLink: string
      me: null | {
        logout?: () => unknown
        username: string
      }
      search?: (text: string) => unknown
      searchValue?: string
    }
  | {
      status: 'loading'
    }

export const Header: FC<HeaderProps> = props => {
  if (props.status === 'loading') {
    return null
  }
  const { me, organization, avatar, homeLink } = props
  return (
    <div className="header">
      <div className="content">
        <div className="left">
          <a href={organization.url} rel="noopener noreferrer" target="_blank">
            <img className="logo" src={organization.logo} alt="Logo" />
          </a>
          <a href={homeLink} rel="noopener noreferrer" target="_blank">
            <div className="text">MoodleNet</div>
          </a>
        </div>
        <div className="right">
          <img className="big-search-icon" src={searchIcon} alt="Search" />
          <div className="search-box">
            <img className="search-icon" src={searchIcon} alt="Search" />
            <input className="search-text" placeholder="Search for anything!" />
          </div>
          {me ? (
            <>
              <img className="add-icon" src={addIcon} alt="Add" />
              <img className="avatar" src={avatar} alt="Avatar" />
            </>
          ) : (
            <>
              <div className="signin-btn">
                <PrimaryButton>Sign In</PrimaryButton>
              </div>
              <div className="signup-btn">
                <TertiaryButton>Sign Up</TertiaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
