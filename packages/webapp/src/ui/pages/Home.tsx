import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Header, Image } from 'semantic-ui-react'
import { UsePageHeaderProps } from '../components/PageHeader'
import logo from '../static/img/moodlenet-logo.png'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

export type HomePageProps = {
  usePageHeaderProps: UsePageHeaderProps
}
export const HomePage: FC<HomePageProps> = ({ usePageHeaderProps }) => {
  return (
    <HeaderPageTemplate useProps={usePageHeaderProps}>
      <Header>
        <Trans>Welcome to</Trans>
      </Header>
      <Image src={logo} size="huge" centered />
    </HeaderPageTemplate>
  )
}
