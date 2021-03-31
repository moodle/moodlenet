import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Dropdown, Icon, Image, Menu } from 'semantic-ui-react'
import { Link } from '../elements/link'
import logo from '../static/img/logo.jpg'

export type PageHeaderProps = {
  homeLink: string
  loginLink: string

  logout(): unknown
  username: null | string

  search(text: string): unknown
  searchValue: string
}

export const PageHeader: FC<PageHeaderProps> = ({ searchValue, search, homeLink, loginLink, logout, username }) => {
  return (
    <Menu fixed="top">
      <Link href={homeLink}>
        <Menu.Item header>
          <Image size="mini" src={logo} style={{ marginRight: '1.5em' }} />
          MoodleNet
        </Menu.Item>
      </Link>
      <Menu.Item header>
        <div className="ui search">
          <div className="ui icon search input">
            <input
              autoFocus={!!searchValue}
              className="prompt"
              type="text"
              defaultValue={searchValue}
              placeholder="Search..."
              onInput={e => {
                //if (e.key === 'Enter') {
                search(e.currentTarget.value)
                //}
              }}
            />
            <i aria-hidden="true" className="search circular link icon"></i>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item header position="right">
        {username ? (
          <>
            <Dropdown item text={username} simple icon={<Icon fitted name="user circle" size="big" color="orange" />}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout}>
                  <Trans>Logout</Trans>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Trans>Add Resource</Trans>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Trans>Add Collection</Trans>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          <Link href={loginLink}>
            <Trans>Sign in</Trans>
            <Icon fitted name="user circle outline" size="big" color="orange" />
          </Link>
        )}
      </Menu.Item>
    </Menu>
  )
}
