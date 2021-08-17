import { t, Trans } from '@lingui/macro'
import { ChangeEventHandler, useCallback, useReducer } from 'react'
import Checkbox from '../../components/atoms/Checkbox/Checkbox'
import SecondaryButton from '../../components/atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../../components/cards/CollectionCard/CollectionCard'
import FilterCard from '../../components/cards/FilterCard/FilterCard'
import ListCard from '../../components/cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../../components/cards/ResourceCard/ResourceCard'
import SortCard from '../../components/cards/SortCard/SortCard'
import SubjectCard, { SubjectCardProps } from '../../components/cards/SubjectCard/SubjectCard'
import { CP, withCtrl } from '../../lib/ctrl'
import { HeaderPageTemplate, HeaderPageTemplateProps } from '../../templates/page/HeaderPageTemplate'
import './styles.scss'

type FilterType = 'Subjects' | 'Collections' | 'Resources'
type SortType = 'Relevance' | 'Recent' | 'Popularity'
export type SearchProps = {
  headerPageTemplateProps: CP<HeaderPageTemplateProps>
  subjectCardPropsList: CP<SubjectCardProps>[]
  collectionCardPropsList: CP<CollectionCardProps>[]
  resourceCardPropsList: CP<ResourceCardProps>[]
  setSortBy(sortType: SortType): unknown
}
export const Search = withCtrl<SearchProps>(
  ({ headerPageTemplateProps, subjectCardPropsList, collectionCardPropsList, resourceCardPropsList, setSortBy }) => {
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
    return (
      <HeaderPageTemplate {...headerPageTemplateProps}>
        <div className="search">
          <div className="content">
            <div className="side-column">
              <FilterCard
                className="filter"
                title={t`Filters`}
                content={[
                  <Checkbox
                    onChange={setFilterCB}
                    label={t`Categories`}
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
                  content={subjectCardPropsList.slice(0, 8).map((subjectCardProps, i) => (
                    <SubjectCard {...subjectCardProps} key={i} />
                  ))}
                  className="subjects"
                  noCard={true}
                >
                  <div className="card-header">
                    <div className="title">
                      <Trans>Categories</Trans>
                    </div>
                    <SecondaryButton>
                      <Trans>See all</Trans>
                    </SecondaryButton>
                  </div>
                </ListCard>
              )}
              {filters.Collections && (
                <ListCard
                  content={collectionCardPropsList.slice(0, 4).map((collectionCardProps, i) => (
                    <CollectionCard {...collectionCardProps} key={i}/>
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
                  content={resourceCardPropsList.slice(0, 8).map((resourceCardProps, i) => (
                    <ResourceCard {...resourceCardProps} key={i}/>
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
      </HeaderPageTemplate>
    )
  },
)
Search.displayName = 'SearchPage'
