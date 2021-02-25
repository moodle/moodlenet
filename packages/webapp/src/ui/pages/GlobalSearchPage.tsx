import { FC } from 'react'
import { Item } from 'semantic-ui-react'
import { BaseContentNodeFeed } from '../components/BaseContentNodeFeed'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'
import { ContentNode } from '../types/types'

export type GlobalSearchPageProps = {
  items: ContentNode[]
}
export const GlobalSearchPage: FC<GlobalSearchPageProps> = ({ items }) => {
  return (
    <HeaderPageTemplate>
      <Item.Group>
        {items.map(item => (
          <BaseContentNodeFeed key={item._id} item={item} />
        ))}
      </Item.Group>
    </HeaderPageTemplate>
  )
}
