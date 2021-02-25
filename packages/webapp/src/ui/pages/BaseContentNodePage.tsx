import { FC } from 'react'
import { BaseContentNodePanel } from '../components/BaseContentNodePanel'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'
import { ContentNode } from '../types/types'

export type BaseContentPropsNodePage = {
  item: ContentNode
}
export const BaseContentNodePage: FC<BaseContentPropsNodePage> = ({ item }) => {
  return (
    <HeaderPageTemplate>
      <BaseContentNodePanel item={item} />
    </HeaderPageTemplate>
  )
}
