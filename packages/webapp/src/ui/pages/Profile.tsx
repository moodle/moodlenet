import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Grid, Icon, Image, Segment } from 'semantic-ui-react'
import { UsePageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

export type ProfilePageProps = {
  usePageHeaderProps: UsePageHeaderProps
  name: string
  me: null | {
    toggleFollow(): unknown
    following: boolean
  }
  followers: number
  icon: string
}

export const ProfilePage: FC<ProfilePageProps> = ({ usePageHeaderProps, followers, me, name, icon }) => {
  return (
    <HeaderPageTemplate useProps={usePageHeaderProps}>
      <Grid columns={2} divided>
        <Grid.Row columns={2}>
          <Grid.Column width={10}>
            <Segment.Group horizontal>
              <Segment>
                <h3>@{name}@moodle.net</h3>
                {me ? (
                  <Button basic onClick={me?.toggleFollow}>
                    {me.following ? <Trans>Unfollow</Trans> : <Trans>Follow</Trans>}
                  </Button>
                ) : null}
              </Segment>
              <Segment floated="right">
                <span style={{ color: 'blue' }}>{followers}</span>
                <Icon name="users" color="blue" size="large" />
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column width={6}>
            <Segment>
              <Image src={icon} size="large" fluid rounded />
            </Segment>
          </Grid.Column>{' '}
        </Grid.Row>
      </Grid>
    </HeaderPageTemplate>
  )
}
