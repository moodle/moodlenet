import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Card, Image, Segment, SegmentGroup } from 'semantic-ui-react'
import { Link } from '../../elements/link'

export type CollectionCardProps = {
  icon: string | null
  name: string
  followers: number
  resources: number
  homeLink: string
}
export const CollectionCard: FC<CollectionCardProps> = props => {
  const { icon, name, homeLink, followers, resources } = props
  return (
    <Card fluid>
      <Card.Content>
        <Image floated="left" size="mini" src={icon} />
        <Card.Header>
          <Link href={homeLink}>{name}</Link>
        </Card.Header>
      </Card.Content>
      <Card.Content extra>
        <SegmentGroup horizontal>
          <Segment>
            {followers} <Trans>Followers</Trans>
          </Segment>
          <Segment>
            {resources} <Trans>Resources</Trans>
          </Segment>
        </SegmentGroup>
      </Card.Content>
    </Card>
  )
}
