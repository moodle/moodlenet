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
  headerPageTemplateWithProps: WithProps<HeaderPageTemplateProps>
  filterCardProps: FilterCardProps
  subjectCardWithPropsList: WithPropsList<SubjectCardProps>
  collectionCardWithPropsList: WithPropsList<CollectionCardProps>
  resourceCardWithPropsList: WithPropsList<ResourceCardProps>
}

export const Search: FC<SearchProps> = ({
  headerPageTemplateWithProps,
  filterCardProps,
  subjectCardWithPropsList,
  collectionCardWithPropsList,
  resourceCardWithPropsList,
}) => {
  const [HeaderPageTemplateCtrl, headerPageTemplateProps] = headerPageTemplateWithProps(HeaderPageTemplate)
  const [SubjectCardCtrl, subjectCardPropsList] = subjectCardWithPropsList(SubjectCard)
  const [CollectionCardCtrl, collectionCardPropsList] = collectionCardWithPropsList(CollectionCard)
  const [ResourceCardCtrl, resourceCardPropsList] = resourceCardWithPropsList(ResourceCard)
  return (
    <HeaderPageTemplateCtrl {...headerPageTemplateProps}>
      <div className="search">
        <div className="content">
          <div className="side-column">
            <FilterCard {...filterCardProps} />
          </div>
          <div className="main-column">
            <ListCard
              content={subjectCardPropsList.slice(0, 4).map(subjectCardProps => (
                <SubjectCardCtrl {...subjectCardProps} />
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
                <CollectionCardCtrl {...collectionCardProps} />
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
                <ResourceCardCtrl {...resourcesCardProps} />
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
    </HeaderPageTemplateCtrl>
  )
}
