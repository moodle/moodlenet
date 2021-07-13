import { Trans } from '@lingui/macro'
import { FC } from 'react'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { FilterCard, FilterCardProps } from '../../components/cards/FilterCard/FilterCard'
import ListCard from '../../components/cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import SubjectCard, { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { HeaderPageTemplate } from '../../templates/page/HeaderPageTemplate'
import { HeaderPageProps } from '../HeaderPage/HeaderPage'
import './styles.scss'

export type SearchProps = {
  headerPageProps: HeaderPageProps
  filterCardProps: FilterCardProps
  subjectCardPropsList: SubjectCardProps[]
  collectionCardPropsList: CollectionCardProps[]
  resourceCardPropsList: ResourceCardProps[]
}

export const Search: FC<SearchProps> = ({
  headerPageProps,
  filterCardProps,
  subjectCardPropsList,
  collectionCardPropsList,
  resourceCardPropsList,
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
              content={subjectCardPropsList.slice(0,4).map(subjectCardProps => (
                <SubjectCard {...subjectCardProps} />
              ))}
              className="subjects"
              noCard={true}
              maxColumns={5}
            > 
              <div className="card-header">
                <div className="title"><Trans>Subjects</Trans></div>
                <SecondaryButton><Trans>See all</Trans></SecondaryButton>
              </div>
            </ListCard>
            <ListCard
              content={collectionCardPropsList.slice(0,3).map(collectionCardProps => (
                <CollectionCard {...collectionCardProps} />
              ))}
              className="collections"
              noCard={true}
            > 
              <div className="card-header">
                <div className="title"><Trans>Collections</Trans></div>
                <SecondaryButton><Trans>See all</Trans></SecondaryButton>
              </div>
            </ListCard>
            <ListCard
              content={resourceCardPropsList.slice(0,5).map(resourcesCardProps => (
                <ResourceCard {...resourcesCardProps} />
              ))}
              className="resources"
              noCard={true}
            >
              <div className="card-header">
                <div className="title"><Trans>Resources</Trans></div>
              </div>
            </ListCard>
          </div>
        </div>
      </div>
    </HeaderPageTemplate>
  )
}
