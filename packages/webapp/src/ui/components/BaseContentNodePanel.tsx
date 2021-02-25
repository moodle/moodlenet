import { FC } from 'react'
import { Card, Image } from 'semantic-ui-react'
import { useLink } from '../context'
import { contentNodeLink } from '../lib'
import { ContentNode } from '../types/types'

export type BaseContentPropsNodePanel = {
  item: ContentNode
}
export const BaseContentNodePanel: FC<BaseContentPropsNodePanel> = ({ item }) => {
  const Link = useLink()
  return (
    <Card>
      <Link href={contentNodeLink(item)}>
        <Image src={item.icon} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{item.name}</Card.Header>
          <Card.Meta>{item.__typename}</Card.Meta>
          <Card.Description>{item.summary}</Card.Description>
        </Card.Content>
      </Link>
    </Card>
  )
}
