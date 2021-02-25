import { FC } from 'react'
import { Item } from 'semantic-ui-react'
import { useLink } from '../context'
import { contentNodeLink } from '../lib'
import { ContentNode } from '../types/types'

export type BaseContentPropsNodeFeed = {
  item: ContentNode
}
export const BaseContentNodeFeed: FC<BaseContentPropsNodeFeed> = ({ item }) => {
  const Link = useLink()
  return (
    <Item>
      <Item.Image size="tiny" src={item.icon} />

      <Item.Content>
        <Link href={contentNodeLink(item)}>
          <Item.Header>{item.name}</Item.Header>
        </Link>
        <Item.Meta>{item.__typename}</Item.Meta>
        <Item.Description>{item.summary}</Item.Description>
      </Item.Content>
    </Item>
  )
}
