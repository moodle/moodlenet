import { FC } from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import { Link } from '../elements/link'

export type BaseContentNodePanelProps = {
  icon: string | null
  name: string
  summary: string
  type: string
  link: string
  likers: number
  followers: number
}
export const BaseContentNodePanel: FC<BaseContentNodePanelProps> = ({
  icon,
  link,
  name,
  summary,
  type,
  followers,
  likers,
}) => {
  return (
    <Card>
      <Image src={icon} wrapped ui={false} />
      <Card.Content>
        <Link href={link} activeStyle={{ color: 'black' }}>
          <Card.Header>{name}</Card.Header>
        </Link>
        <Card.Meta>{type}</Card.Meta>
        <Card.Description>{summary}</Card.Description>
        <Card.Meta>
          <Icon color="orange" name="heart" style={{ marginRight: '3em' }}>
            {likers}
          </Icon>
          <Icon color="blue" name="user">
            {followers}
          </Icon>
        </Card.Meta>
      </Card.Content>
    </Card>
  )
}
