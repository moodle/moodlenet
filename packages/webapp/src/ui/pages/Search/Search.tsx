import { t } from '@lingui/macro'
import { FC } from 'react'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { FilterCard, FilterCardProps } from '../../components/cards/FilterCard/FilterCard'
import ListCard from '../../components/cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import { HeaderPageTemplate } from '../../templates/page/HeaderPageTemplate'
import { HeaderPageProps } from '../HeaderPage/HeaderPage'
import './styles.scss'

export type SearchProps = {
  headerPageProps: HeaderPageProps
  filterCardProps: FilterCardProps
  collectionCardPropsList: CollectionCardProps[]
  resourceCardPropsList: ResourceCardProps[]
}

export const Search: FC<SearchProps> = ({
  headerPageProps,
  filterCardProps,
  collectionCardPropsList,
  resourceCardPropsList
}) => {
  return (
    <HeaderPageTemplate headerPageProps={headerPageProps}>
      <div className="search">
        <div className="content">
          <div className="side-column">
              <FilterCard {...filterCardProps} />
          </div>
          <div className="main-column">
            <ListCard
              title={t`Collection`}
              content={collectionCardPropsList.map(collectionCardProps => (
                <CollectionCard {...collectionCardProps} />
              ))}
              className="collections"
              noCard={true}
            />
            <ListCard
              content={resourceCardPropsList.map(resourcesCardProps => (
                <ResourceCard {...resourcesCardProps} />
              ))}
              title={t`Latest Resources`}
              className="resources"
              noCard={true}
            />
          </div>
        </div>
      </div>
    </HeaderPageTemplate>
  )
}
