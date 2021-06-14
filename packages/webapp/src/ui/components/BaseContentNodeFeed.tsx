import { FC } from 'react'
import { Icon, Item } from 'semantic-ui-react'
import { Link } from '../elements/link'

export type BaseContentNodeFeedProps = {
  icon: string | null
  name: string
  summary: string
  likers: number
  followers: number
  type: string
  link: string
}
export const BaseContentNodeFeed: FC<BaseContentNodeFeedProps> = ({ icon, name, summary, type, link, followers, likers } ) => {
  return (
    <Item>
      <Item.Image size="tiny" src={icon} />
      <Item.Content>
        <Link href={link}>
          <Item.Header>{name}</Item.Header>
        </Link>
        <Item.Meta>{type}</Item.Meta>
        <Item.Description>{summary}</Item.Description>
        <Item.Extra>
          <Icon color="orange" name="heart" style={{ marginRight: '3em' }}>
            {likers}
          </Icon>
          <Icon color="blue" name="user">
            {followers}
          </Icon>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}
