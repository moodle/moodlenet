import { Trans } from '@lingui/macro'
import { FC } from 'react'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import { FilterCard, FilterCardProps } from '../../components/cards/FilterCard/FilterCard'
import ListCard from '../../components/cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import SubjectCard, { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { WithProps, WithPropsList } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

export type SearchProps = {
  withHeaderPageTemplateProps: WithProps<HeaderPageTemplateProps>
  filterCardProps: FilterCardProps
  withSubjectCardPropsList: WithPropsList<SubjectCardProps>
  withCollectionCardPropsList: WithPropsList<CollectionCardProps>
  withResourceCardPropsList: WithPropsList<ResourceCardProps>
}

export const Search: FC<SearchProps> = ({
  withHeaderPageTemplateProps,
  filterCardProps,
  withSubjectCardPropsList,
  withCollectionCardPropsList,
  withResourceCardPropsList,
}) => {
  const [HeaderPageTemplateWithProps, headerPageTemplateProps] = withHeaderPageTemplateProps(HeaderPageTemplate)
  const [SubjectCardWithProps, subjectCardPropsList] = withSubjectCardPropsList(SubjectCard)
  const [CollectionCardWithProps, collectionCardPropsList] = withCollectionCardPropsList(CollectionCard)
  const [ResourceCardWithProps, resourceCardPropsList] = withResourceCardPropsList(ResourceCard)
  return (
    <HeaderPageTemplateWithProps {...headerPageTemplateProps}>
      <div className="search">
        <div className="content">
          <div className="side-column">
            <FilterCard {...filterCardProps} />
          </div>
          <div className="main-column">
            <ListCard
              content={subjectCardPropsList.slice(0, 4).map(subjectCardProps => (
                <SubjectCardWithProps {...subjectCardProps} />
              ))}
              className="subjects"
              noCard={true}
              maxColumns={5}
            >
              <div className="card-header">
                <div className="title">
                  <Trans>Subjects</Trans>
                </div>
                <SecondaryButton>
                  <Trans>See all</Trans>
                </SecondaryButton>
              </div>
            </ListCard>
            <ListCard
              content={collectionCardPropsList.slice(0, 3).map(collectionCardProps => (
                <CollectionCardWithProps {...collectionCardProps} />
              ))}
              className="collections"
              noCard={true}
            >
              <div className="card-header">
                <div className="title">
                  <Trans>Collections</Trans>
                </div>
                <SecondaryButton>
                  <Trans>See all</Trans>
                </SecondaryButton>
              </div>
            </ListCard>
            <ListCard
              content={resourceCardPropsList.slice(0, 5).map(resourcesCardProps => (
                <ResourceCardWithProps {...resourcesCardProps} />
              ))}
              className="resources"
              noCard={true}
            >
              <div className="card-header">
                <div className="title">
                  <Trans>Resources</Trans>
                </div>
              </div>
            </ListCard>
          </div>
        </div>
      </div>
    </HeaderPageTemplateWithProps>
  )
}
