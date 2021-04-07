import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { Button, Card, Dropdown, Grid, Icon, Image, Segment } from 'semantic-ui-react'
import { PageHeaderProps } from '../components/PageHeader'
import { Link } from '../elements/link'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

export type ResourcePageProps = {
  pageHeaderProps: PageHeaderProps
  name: string
  type: string
  me: null | {
    toggleLike(): unknown
    liking: boolean
    myCollections: {
      homeLink: string
      name: string
      icon: string | null
      addToThisCollection: () => unknown
    }[]
  }
  likers: number
  created: Date
  icon: string
  summary: string
  creator: {
    icon: string
    name: string
    homeLink: string
  }
}

export const ResourcePage: FC<ResourcePageProps> = ({
  pageHeaderProps,
  created,
  likers,
  type,
  me,
  name,
  creator,
  icon,
  summary,
}) => {
  return (
    <HeaderPageTemplate pageHeaderProps={pageHeaderProps}>
      <Grid columns={2} divided>
        <Grid.Row columns={2}>
          <Grid.Column width={8}>
            <Segment>
              <h3>{name}</h3>
              <Image src={icon} size="large" rounded />
              <span>{summary}</span>
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
                {!me?.myCollections.length ? null : (
                  <>
                    <hr />
                    <Dropdown
                      item
                      text={t`add to my collection`}
                      simple
                      icon={<Icon fitted name="folder open outline" size="large" color="orange" />}
                    >
                      <Dropdown.Menu>
                        {me.myCollections.map(coll => (
                          <Dropdown.Item key={coll.homeLink}>
                            <Card fluid>
                              <Card.Content>
                                <Image floated="left" size="mini" src={coll.icon} />
                                <Card.Header>
                                  <Link href={coll.homeLink}>{coll.name}</Link>
                                </Card.Header>
                              </Card.Content>
                              <Card.Content extra>
                                <Button onClick={coll.addToThisCollection}>
                                  <Trans>Add</Trans>
                                </Button>
                              </Card.Content>
                            </Card>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                )}
              </Segment>
              <Segment>
                <Segment.Inline>
                  <span style={{ color: 'red' }}>{likers}</span>
                  {me ? (
                    <Icon.Group size="large" onClick={me?.toggleLike} style={{ cursor: 'pointer' }}>
                      <Icon color="red" name={me.liking ? 'heart' : 'heart outline'} />
                      <Icon color="red" corner="bottom right" name={me.liking ? 'minus' : 'add'} />
                    </Icon.Group>
                  ) : (
                    <Icon name="heart outline" color="red" size="large" />
                  )}
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
                    </Trans>
                    {created} <br />
                    <Trans>by</Trans>
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
