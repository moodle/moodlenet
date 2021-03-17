import { t } from '@lingui/macro'
import { FC } from 'react'
import { Checkbox, Divider, Grid, Item } from 'semantic-ui-react'
import { BaseContentNodeFeed, UseBaseContentNodeFeedProps } from '../components/BaseContentNodeFeed'
import { UsePageHeaderProps } from '../components/PageHeader'
import { HeaderPageTemplate } from '../templates/page/HeaderPageTemplate'
import { UseProps, UsePropsList } from '../types'

type ContentType = 'Resource' | 'Collection' | 'Subject'
type SortType = 'Pertinence' | 'Popularity'
export type GlobalSearchPageProps = {
  usePageHeaderProps: UsePageHeaderProps
  useBaseContentNodeFeedPropsList: UsePropsList<UseBaseContentNodeFeedProps>
  useProps: UseProps<UseGlobalSearchPageProps>
}
export type UseGlobalSearchPageProps = {
  setTypeFilter(type: ContentType, include: boolean): unknown
  typeFilters: ContentType[]
  setSortBy(type: SortType): unknown
  sortBy: SortType
}
export const GlobalSearchPage: FC<GlobalSearchPageProps> = ({
  usePageHeaderProps,
  useBaseContentNodeFeedPropsList,
  useProps,
}) => {
  const { setTypeFilter, typeFilters, setSortBy, sortBy } = useProps()

  return (
    <HeaderPageTemplate useProps={usePageHeaderProps}>
      <Grid>
        <Grid.Column width={10}>
          <Item.Group>
            {useBaseContentNodeFeedPropsList.map(([useBaseContentNodeFeedProps, key]) => (
              <BaseContentNodeFeed key={key} useProps={useBaseContentNodeFeedProps} />
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
            checked={sortBy === 'Pertinence'}
            name="sortBy"
            onChange={() => setSortBy('Pertinence')}
            label={t`Pertinence`}
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
