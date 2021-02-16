import { FC } from 'react'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'
import logo from '../static/img/moodlenet-logo.png'
import { Header, Image } from 'semantic-ui-react'
import { Trans } from '@lingui/macro'

export type HomePageProps = {}
export const HomePage: FC<HomePageProps> = () => {
  return (
    <HeaderPageTemplate>
      <Header>
        <Trans>Welcome to Moodlenet!</Trans>
      </Header>
      <Image src={logo} size="huge" centered />
    </HeaderPageTemplate>
  )
}
