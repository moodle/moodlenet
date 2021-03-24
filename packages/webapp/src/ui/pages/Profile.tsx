import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Grid, Icon, Image, Segment } from 'semantic-ui-react'
import { CollectionCard, CollectionCardProps } from '../components/cards/Collection'
import { ResourceCard, ResourceCardProps } from '../components/cards/Resource'
import { PageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

export type ProfilePageProps = {
  pageHeaderProps: PageHeaderProps
  name: string
  summary: string
  me: null | {
    toggleFollow(): unknown
    following: boolean
  }
  followers: number
  icon: string
  collections: CollectionCardProps[]
  resources: ResourceCardProps[]
}

export const ProfilePage: FC<ProfilePageProps> = ({
  pageHeaderProps,
  followers,
  me,
  name,
  icon,
  summary,
  collections,
  resources,
}) => {
  return (
    <HeaderPageTemplate pageHeaderProps={pageHeaderProps}>
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column width={10}>
            <Segment.Group horizontal>
              <Segment>
                <h1>{name}</h1>
                <h5>@{name}@moodle.net</h5>
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
            <Segment>
              <h3>
                <Trans>About me</Trans>
              </h3>
              {summary}
            </Segment>
            <Segment>
              <h3>
                <Trans>Collections I maintain</Trans>
              </h3>
              {collections.map(collProps => (
                <CollectionCard {...collProps} />
              ))}
            </Segment>
            <Segment>
              <h3>
                <Trans>Resources I've added</Trans>
              </h3>
              {resources.map(resProps => (
                <ResourceCard {...resProps} />
              ))}
            </Segment>
          </Grid.Column>
          <Grid.Column width={6}>
            <Segment>
              <Image src={icon} size="large" fluid rounded />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </HeaderPageTemplate>
  )
}
