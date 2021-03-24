import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Header, Image } from 'semantic-ui-react'
import { PageHeaderProps } from '../components/PageHeader'
import logo from '../static/img/moodlenet-logo.png'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

export type HomePageProps = {
  pageHeaderProps: PageHeaderProps
}
export const HomePage: FC<HomePageProps> = ({ pageHeaderProps }) => {
  return (
    <HeaderPageTemplate pageHeaderProps={pageHeaderProps}>
      <Header>
        <Trans>Welcome to</Trans>
      </Header>
      <Image src={logo} size="huge" centered />
    </HeaderPageTemplate>
  )
}
