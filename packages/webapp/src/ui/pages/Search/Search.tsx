import { t, Trans } from '@lingui/macro'
import { ChangeEventHandler, FC, useCallback, useReducer } from 'react'
import Checkbox from '../../components/atoms/Checkbox/Checkbox'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import FilterCard from '../../components/cards/FilterCard/FilterCard'
import ListCard from '../../components/cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import SortCard from '../../components/cards/SortCard/SortCard'
import SubjectCard, { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { WithProps, WithPropsList } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

type FilterType = 'Subjects' | 'Collections' | 'Resources'
type SortType = 'Relevance' | 'Recent' | 'Popularity'
export type SearchProps = {
  headerPageTemplateWithProps: WithProps<HeaderPageTemplateProps>
  subjectCardWithPropsList: WithPropsList<SubjectCardProps>
  collectionCardWithPropsList: WithPropsList<CollectionCardProps>
  resourceCardWithPropsList: WithPropsList<ResourceCardProps>
  setSortBy(sortType: SortType): unknown
}
export const Search: FC<SearchProps> = ({
  headerPageTemplateWithProps,
  subjectCardWithPropsList,
  collectionCardWithPropsList,
  resourceCardWithPropsList,
  setSortBy,
}) => {
  const [filters, setFilter] = useReducer(
    (prev: Record<FilterType, boolean>, [type, checked]: readonly [FilterType, boolean]) => ({
      ...prev,
      [type]: checked,
    }),
    {
      Subjects: true,
      Collections: true,
      Resources: true,
    },
  )

  const setFilterCB = useCallback<ChangeEventHandler<HTMLInputElement>>(ev => {
    setFilter([ev.currentTarget.name as FilterType, ev.currentTarget.checked])
  }, [])
  const [HeaderPageTemplateCtrl, headerPageTemplateProps] = headerPageTemplateWithProps(HeaderPageTemplate)
  const [SubjectCardCtrl, subjectCardPropsList] = subjectCardWithPropsList(SubjectCard)
  const [CollectionCardCtrl, collectionCardPropsList] = collectionCardWithPropsList(CollectionCard)
  const [ResourceCardCtrl, resourceCardPropsList] = resourceCardWithPropsList(ResourceCard)
  return (
    <HeaderPageTemplateCtrl {...headerPageTemplateProps}>
      <div className="search">
        <div className="content">
          <div className="side-column">
            <FilterCard
              className="filter"
              title={t`Filters`}
              content={[
                <Checkbox
                  onChange={setFilterCB}
                  label={t`Subjects`}
                  name="Subjects"
                  key="Subjects"
                  checked={filters.Subjects}
                />,
                <Checkbox
                  onChange={setFilterCB}
                  label={t`Collections`}
                  name="Collections"
                  key="Collections"
                  checked={filters.Collections}
                />,
                <Checkbox
                  onChange={setFilterCB}
                  label={t`Resources`}
                  name="Resources"
                  key="Resources"
                  checked={filters.Resources}
                />,
              ]}
            />
            <SortCard
              className="sort"
              title={t`Sort`}
              content={[
                ['Relevance', t`Relevance`, 'inactive'],
                ['Recent', t`Recent`, 'more'],
                ['Popularity', t`Popularity`, 'inactive'],
              ]}
              onChange={setSortBy}
            />
          </div>
          <div className="main-column">
            {filters.Subjects && (
              <ListCard
                content={subjectCardPropsList.slice(0, 8).map(subjectCardProps => (
                  <SubjectCardCtrl {...subjectCardProps} />
                ))}
                className="subjects"
                noCard={true}
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
            )}
            {filters.Collections && (
              <ListCard
                content={collectionCardPropsList.slice(0, 4).map(collectionCardProps => (
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
            )}
            {filters.Resources && (
              <ListCard
                content={resourceCardPropsList.slice(0, 8).map(resourcesCardProps => (
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
            )}
          </div>
        </div>
      </div>
    </HeaderPageTemplateCtrl>
  )
}
