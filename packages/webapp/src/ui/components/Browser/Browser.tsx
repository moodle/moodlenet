import { t, Trans } from '@lingui/macro'
import { ChangeEventHandler, useCallback, useReducer } from 'react'
import { CP, withCtrl } from '../../lib/ctrl'
import Checkbox from '../atoms/Checkbox/Checkbox'
import SecondaryButton from '../atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../cards/CollectionCard/CollectionCard'
import FilterCard, { FilterCardDirection } from '../cards/FilterCard/FilterCard'
import ListCard from '../cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../cards/ResourceCard/ResourceCard'
import { SortState } from '../cards/SortCard/SortButton/SortButton'
import SortCard, { SortCardDirection } from '../cards/SortCard/SortCard'
import SubjectCard, { SubjectCardProps } from '../cards/SubjectCard/SubjectCard'
import './styles.scss'

export const filterTypes = ['Subjects', 'Collections', 'Resources'] as const
export type FilterType = typeof filterTypes[number]
type SortType = 'Relevance' | 'Recent' | 'Popularity'
export type BrowserProps = {
  subjectCardPropsList: CP<SubjectCardProps>[] | null
  collectionCardPropsList: CP<CollectionCardProps>[] | null
  resourceCardPropsList: CP<ResourceCardProps>[] | null
  setSortBy: ((sortType: SortType, dir: SortState) => unknown) | null
}
export const Browser = withCtrl<BrowserProps>(
  ({ subjectCardPropsList, collectionCardPropsList, resourceCardPropsList, setSortBy }) => {
    const [filters, setFilter] = useReducer(
      (prev: Record<FilterType, boolean>, [type, checked]: readonly [FilterType, boolean]) => ({
        ...prev,
        [type]: checked,
      }),
      {
        Subjects: subjectCardPropsList !== null,
        Collections: !collectionCardPropsList !== null,
        Resources: !resourceCardPropsList !== null,
      },
    )

    const seeAll = (type: FilterType) => {
      filterTypes.forEach((filterType: FilterType) => {
        filterType !== type && setFilter([filterType, false])
      })
    }

    const shouldShowSeeAll = (type: FilterType): boolean => {
      let shouldShowSeeAll = false
      filterTypes.forEach((filterType: FilterType) => {
        if (filterType !== type && filters[filterType]) {
          shouldShowSeeAll = true
        }
      }, [])
      // TODO If shouldShowSeeAll === false we should activate infinite scroll
      return shouldShowSeeAll
    }

    const setFilterCB = useCallback<ChangeEventHandler<HTMLInputElement>>(ev => {
      setFilter([ev.currentTarget.name as FilterType, ev.currentTarget.checked])
    }, [])

    const filterCard = (direction: FilterCardDirection) => (
      <FilterCard
        className="filter"
        title={t`Filters`}
        direction={direction}
        content={[
          subjectCardPropsList && (
            <Checkbox
              onChange={setFilterCB}
              label={t`Categories`}
              name="Subjects"
              key="Subjects"
              checked={filters.Subjects}
            />
          ),
          collectionCardPropsList && (
            <Checkbox
              onChange={setFilterCB}
              label={t`Collections`}
              name="Collections"
              key="Collections"
              checked={filters.Collections}
            />
          ),
          resourceCardPropsList && (
            <Checkbox
              onChange={setFilterCB}
              label={t`Resources`}
              name="Resources"
              key="Resources"
              checked={filters.Resources}
            />
          ),
        ]}
      />
    )

    const sortCard = (direction: SortCardDirection) =>
      setSortBy && (
        <SortCard
          className="sort"
          title={t`Sort`}
          direction={direction}
          content={[
            ['Relevance', t`Relevance`, 'inactive'],
            ['Recent', t`Recent`, 'more'],
            ['Popularity', t`Popularity`, 'inactive'],
          ]}
          onChange={setSortBy}
        />
      )

    return (
      <div className="browser">
        <div className="content">
          <div className="side-column">
            {filterCard('vertical')}
            {sortCard('vertical')}
          </div>
          <div className="main-column">
            <div className="filter-and-sort">
              {filterCard('horizontal')}
              {sortCard('horizontal')}
            </div>
            {subjectCardPropsList && filters.Subjects && (
              <ListCard
                content={(shouldShowSeeAll('Subjects') ? subjectCardPropsList.slice(0, 8) : subjectCardPropsList).map(
                  subjectCardProps => (
                    <SubjectCard {...subjectCardProps} />
                  ),
                )}
                className={`subjects ${!shouldShowSeeAll('Subjects') ? 'see-all' : ''}`}
                noCard={true}
              >
                <div className="card-header">
                  <div className="title">
                    <Trans>Categories</Trans>
                  </div>
                  {shouldShowSeeAll('Subjects') && (
                    <SecondaryButton onClick={() => seeAll('Subjects')}>
                      <Trans>See all</Trans>
                    </SecondaryButton>
                  )}
                </div>
              </ListCard>
            )}
            {collectionCardPropsList && filters.Collections && (
              <ListCard
                content={(shouldShowSeeAll('Collections')
                  ? collectionCardPropsList.slice(0, 6)
                  : collectionCardPropsList
                ).map(collectionCardProps => (
                  <CollectionCard {...collectionCardProps} />
                ))}
                className={`collections ${!shouldShowSeeAll('Collections') ? 'see-all' : ''}`}
                noCard={true}
              >
                <div className="card-header">
                  <div className="title">
                    <Trans>Collections</Trans>
                  </div>
                  {shouldShowSeeAll('Collections') && (
                    <SecondaryButton onClick={() => seeAll('Collections')}>
                      <Trans>See all</Trans>
                    </SecondaryButton>
                  )}
                </div>
              </ListCard>
            )}
            {resourceCardPropsList && filters.Resources && (
              <ListCard
                content={(shouldShowSeeAll('Resources')
                  ? resourceCardPropsList.slice(0, 6)
                  : resourceCardPropsList
                ).map(resourceCardProps => (
                  <ResourceCard {...resourceCardProps} />
                ))}
                className="resources"
                noCard={true}
              >
                <div className="card-header">
                  <div className="title">
                    <Trans>Resources</Trans>
                  </div>
                  {shouldShowSeeAll('Resources') && (
                    <SecondaryButton onClick={() => seeAll('Resources')}>
                      <Trans>See all</Trans>
                    </SecondaryButton>
                  )}
                </div>
              </ListCard>
            )}
          </div>
        </div>
      </div>
    )
  },
)
Browser.displayName = 'BrowserPage'
