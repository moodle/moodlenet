import React, { FC } from 'react'
import { Image, Menu } from 'semantic-ui-react'
import { LinkDef, useLink } from '../context'
import logo from '../static/img/logo.jpg'

export type PageHeaderProps = {
  homeLink: LinkDef
}

export const PageHeader: FC<PageHeaderProps> = ({ homeLink }) => {
  const Link = useLink()
  return (
    <Menu fixed="top">
      <Link href={homeLink}>
        <Menu.Item header>
          <Image size="mini" src={logo} style={{ marginRight: '1.5em' }} />
          MoodleNet
        </Menu.Item>
      </Link>
    </Menu>
  )
}
