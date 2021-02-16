import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Icon, Image, Menu } from 'semantic-ui-react'
import { LinkDef, useLink } from '../context'
import logo from '../static/img/logo.jpg'

export type PageHeaderProps = {
  homeLink: LinkDef
  loginLink: LinkDef
}

export const PageHeader: FC<PageHeaderProps> = ({ homeLink, loginLink }) => {
  const Link = useLink()
  return (
    <Menu fixed="top">
      <Link href={homeLink}>
        <Menu.Item header>
          <Image size="mini" src={logo} style={{ marginRight: '1.5em' }} />
          MoodleNet
        </Menu.Item>
      </Link>
      <Menu.Item header position="right">
        <Link href={loginLink}>
          <Icon circular name="user circle outline" size="large" color="orange" />
          <Trans>Sign in</Trans>
        </Link>
      </Menu.Item>
    </Menu>
  )
}
