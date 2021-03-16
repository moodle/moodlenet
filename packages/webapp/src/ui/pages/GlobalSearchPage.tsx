import { FC } from 'react'
import { Item } from 'semantic-ui-react'
import { BaseContentNodeFeed, UseBaseContentNodeFeedProps } from '../components/BaseContentNodeFeed'
import { UsePageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'
import { UsePropsList } from '../types'

export type GlobalSearchPageProps = {
  usePageHeaderProps: UsePageHeaderProps
  useBaseContentNodeFeedPropsList: UsePropsList<UseBaseContentNodeFeedProps>
}
export const GlobalSearchPage: FC<GlobalSearchPageProps> = ({
  usePageHeaderProps,
  useBaseContentNodeFeedPropsList,
}) => {
  return (
    <HeaderPageTemplate useProps={usePageHeaderProps}>
      <Item.Group>
        {useBaseContentNodeFeedPropsList.map(([useBaseContentNodeFeedProps, key]) => (
          <BaseContentNodeFeed key={key} useProps={useBaseContentNodeFeedProps} />
        ))}
      </Item.Group>
    </HeaderPageTemplate>
  )
}
