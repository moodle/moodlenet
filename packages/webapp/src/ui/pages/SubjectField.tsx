import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Card, Divider, Grid, Segment } from 'semantic-ui-react'
import { CollectionCard, CollectionCardProps } from '../components/cards/Collection'
import { ResourceCard, ResourceCardProps } from '../components/cards/Resource'
import { PageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

export type SubjectFieldPageProps = {
  pageHeaderProps: PageHeaderProps
  collectionList: CollectionCardProps[]
  resourceList: ResourceCardProps[]
  name: string
  summary: string
  me: null | {
    toggleFollow(): unknown
    following: boolean
  }
  followers: number
  collections: number
  resources: number
}

export const SubjectFieldPage: FC<SubjectFieldPageProps> = ({
  pageHeaderProps,
  collectionList,
  collections,
  followers,
  me,
  name,
  summary,
  resourceList,
  resources,
}) => {
  return (
    <HeaderPageTemplate pageHeaderProps={pageHeaderProps}>
      <Grid columns={2} divided>
        <Grid.Row columns={1}>
          <Grid.Column width={10}>
            <Segment.Group horizontal>
              <Segment>
                <h3>
                  <Trans>SubjectField:</Trans>
                </h3>
                <h1>{name}</h1>
                <h5>{summary}</h5>
                {me ? (
                  <Button basic onClick={me?.toggleFollow}>
                    {me.following ? <Trans>Unfollow</Trans> : <Trans>Follow</Trans>}
                  </Button>
                ) : null}
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column width={6}>
            <Segment.Group horizontal>
              <Segment>
                <h6>{followers}</h6>
                <Trans>Followers</Trans>
              </Segment>
              <Segment>
                <h6>{collections}</h6>
                <Trans>Collections</Trans>
              </Segment>
              <Segment>
                <h6>{resources}</h6>
                <Trans>Resources</Trans>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <h3>
              <Trans>Collections</Trans>
            </h3>
            <Card.Group itemsPerRow={3}>
              {collectionList.map(collectionProps => (
                <CollectionCard {...collectionProps} key={collectionProps.homeLink} />
              ))}
            </Card.Group>
            <Divider />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <h3>
              <Trans>Resources</Trans>
            </h3>
            <Card.Group itemsPerRow={1}>
              {resourceList.map(resourceCardProps => (
                <ResourceCard {...resourceCardProps} key={resourceCardProps.homeLink} />
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </HeaderPageTemplate>
  )
}
