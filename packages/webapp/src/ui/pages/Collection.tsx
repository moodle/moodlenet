import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Card, Grid, Icon, Image, Segment } from 'semantic-ui-react'
import { ResourceCard, ResourceCardProps } from '../components/cards/Resource'
import { PageHeaderProps } from '../components/PageHeader'
import { Link } from '../elements/link'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate_Legacy'

export type CollectionPageProps = {
  pageHeaderProps: PageHeaderProps
  resourceList: (ResourceCardProps & { removeResource: null | (() => unknown) })[]
  name: string
  me: null | {
    toggleFollow(): unknown
    following: boolean
  }
  followers: number
  resources: number
  lastUpdated: Date
  icon: string | null
  creator: {
    icon: string | null
    name: string
    homeLink: string
  }
  summary: string
}

export const CollectionPage: FC<CollectionPageProps> = ({
  pageHeaderProps,
  lastUpdated,
  followers,
  me,
  name,
  resourceList,
  resources,
  creator,
  icon,
  summary,
}) => {
  return (
    <HeaderPageTemplate pageHeaderProps={pageHeaderProps}>
      <Grid columns={2} divided>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Segment.Group horizontal>
              <Segment>
                <Image size="medium" src={icon} />
              </Segment>
              <Segment>
                <h3>
                  <Trans>Collection:</Trans>
                </h3>
                <h1>{name}</h1>
                {summary}
              </Segment>
              <Segment floated="right">
                {me ? (
                  <Button basic onClick={me?.toggleFollow}>
                    {me.following ? <Trans>Unfollow</Trans> : <Trans>Follow</Trans>}
                  </Button>
                ) : null}

                <span style={{ color: 'blue' }}>{followers}</span>
                <Icon name="users" color="blue" size="large" />
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={8}>
            <h3>
              <Trans>Resources</Trans>
            </h3>
            <Card.Group>
              {resourceList.map(resourceCardProps => (
                <ResourceCard {...resourceCardProps} key={resourceCardProps.homeLink}>
                  {resourceCardProps.removeResource ? (
                    <Button floated="right" onClick={resourceCardProps.removeResource}>
                      <Trans>Remove</Trans>
                    </Button>
                  ) : null}
                </ResourceCard>
              ))}
            </Card.Group>
          </Grid.Column>
          <Grid.Column width={8}>
            <Link href={creator.homeLink}>
              <Segment.Group horizontal>
                <Segment>
                  <Image size="tiny" src={creator.icon} />
                </Segment>
                <Segment>
                  <h3>
                    <Trans>Collection curated by</Trans>
                  </h3>
                  <h3>{creator.name}</h3>
                </Segment>
              </Segment.Group>
            </Link>
            <Segment.Group horizontal>
              <Segment>
                <h6>{followers}</h6>
                <Trans>Followers</Trans>
              </Segment>
              <Segment>
                <h6>{resources}</h6>
                <Trans>Resources</Trans>
              </Segment>
              <Segment>
                <h6>{lastUpdated}</h6>
                <Trans>Last Updated</Trans>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </HeaderPageTemplate>
  )
}
