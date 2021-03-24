import { t } from '@lingui/macro'
import { FC } from 'react'
import { Checkbox, Divider, Grid, Item } from 'semantic-ui-react'
import { BaseContentNodeFeed, BaseContentNodeFeedProps } from '../components/BaseContentNodeFeed'
import { PageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'

type ContentType = 'Resource' | 'Collection' | 'Subject'
type SortType = 'Relevance' | 'Popularity'
export type GlobalSearchPageProps = {
  pageHeaderProps: PageHeaderProps
  baseContentNodeFeedPropsList: BaseContentNodeFeedProps[]
  setTypeFilter(type: ContentType, include: boolean): unknown
  typeFilters: ContentType[]
  setSortBy(type: SortType): unknown
  sortBy: SortType
}
export const GlobalSearchPage: FC<GlobalSearchPageProps> = ({
  pageHeaderProps,
  baseContentNodeFeedPropsList,
  setSortBy,
  setTypeFilter,
  sortBy,
  typeFilters,
}) => {
  return (
    <HeaderPageTemplate pageHeaderProps={pageHeaderProps}>
      <Grid>
        <Grid.Column width={10}>
          <Item.Group>
            {baseContentNodeFeedPropsList.map(baseContentNodeFeedProps => (
              <BaseContentNodeFeed key={baseContentNodeFeedProps.link} {...baseContentNodeFeedProps} />
            ))}
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={2}>
          <Checkbox
            checked={typeFilters.includes('Resource')}
            onChange={(_ev, data) => setTypeFilter('Resource', !!data.checked)}
            label={t`Include Resources`}
          />
          <Checkbox
            checked={typeFilters.includes('Collection')}
            onChange={(_ev, data) => setTypeFilter('Collection', !!data.checked)}
            label={t`Include Collections`}
          />
          <Checkbox
            checked={typeFilters.includes('Subject')}
            onChange={(_ev, data) => setTypeFilter('Subject', !!data.checked)}
            label={t`Include Subjects`}
          />
          <Divider />
          <span>Sort By</span>
          <Checkbox
            radio
            checked={sortBy === 'Relevance'}
            name="sortBy"
            onChange={() => setSortBy('Relevance')}
            label={t`Relevance`}
          />
          <Checkbox
            radio
            checked={sortBy === 'Popularity'}
            name="sortBy"
            onChange={() => setSortBy('Popularity')}
            label={t`Popularity`}
          />
        </Grid.Column>
      </Grid>
    </HeaderPageTemplate>
  )
}
