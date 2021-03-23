import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Grid, Icon, Image, Segment } from 'semantic-ui-react'
import { UsePageHeaderProps } from '../components/PageHeader'
import { Link } from '../elements/link'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

export type ResourcePageProps = {
  usePageHeaderProps: UsePageHeaderProps
  name: string
  type: string
  me: null | {
    toggleLike(): unknown
    liking: boolean
  }
  likers: number
  created: Date
  icon: string
  creator: {
    icon: string
    name: string
    homeLink: string
  }
}

export const ResourcePage: FC<ResourcePageProps> = ({
  usePageHeaderProps,
  created,
  likers,
  type,
  me,
  name,
  creator,
  icon,
}) => {
  return (
    <HeaderPageTemplate useProps={usePageHeaderProps}>
      <Grid columns={2} divided>
        <Grid.Row columns={2}>
          <Grid.Column width={8}>
            <Segment>
              <h3>{name}</h3>
              <Image src={icon} size="large" fluid rounded />
            </Segment>
          </Grid.Column>
          <Grid.Column width={8}>
            <Segment.Group horizontal>
              <Segment>
                <h3>
                  <Trans>Resource</Trans>
                </h3>
                <h3>{name}</h3>
                {type}
                {me ? (
                  <Button basic onClick={me?.toggleLike}>
                    {me.liking ? <Trans>Unlike</Trans> : <Trans>Like</Trans>}
                  </Button>
                ) : null}
              </Segment>
              <Segment>
                <Segment.Inline>
                  <span style={{ color: 'red' }}>{likers}</span>
                  <Icon name="heart outline" color="red" size="large" />
                </Segment.Inline>
              </Segment>
            </Segment.Group>

            <Link href={creator.homeLink}>
              <Segment.Group horizontal>
                <Segment>
                  <Image size="tiny" src={creator.icon} />
                </Segment>
                <Segment>
                  <h5>
                    <Trans>
                      Uploaded on <br />
                      {created} <br />
                      by
                    </Trans>
                  </h5>
                  <h3>{creator.name}</h3>
                </Segment>
              </Segment.Group>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </HeaderPageTemplate>
  )
}
