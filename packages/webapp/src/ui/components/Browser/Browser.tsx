import { t, Trans } from '@lingui/macro'
import { ChangeEventHandler, useCallback, useMemo, useReducer } from 'react'
import { CP, withCtrl } from '../../lib/ctrl'
import Checkbox from '../atoms/Checkbox/Checkbox'
import SecondaryButton from '../atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../cards/CollectionCard/CollectionCard'
import FilterCard, { FilterCardDirection } from '../cards/FilterCard/FilterCard'
import ListCard from '../cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../cards/ResourceCard/ResourceCard'
import { SmallProfileCard, SmallProfileCardProps } from '../cards/SmallProfileCard/SmallProfileCard'
import { SortState } from '../cards/SortCard/SortButton/SortButton'
import SortCard, { SortCardDirection } from '../cards/SortCard/SortCard'
import SubjectCard, { SubjectCardProps } from '../cards/SubjectCard/SubjectCard'
import './styles.scss'

export const filterTypes = ['Subjects', 'Collections', 'Resources', 'People'] as const
export type FilterType = typeof filterTypes[number]
type SortType = 'Relevance' | 'Recent' | 'Popularity'
export type BrowserProps = {
  subjectCardPropsList: CP<SubjectCardProps>[] | null
  collectionCardPropsList: CP<CollectionCardProps>[] | null
  resourceCardPropsList: CP<ResourceCardProps>[] | null
  smallProfileCardPropsList: CP<SmallProfileCardProps>[] | null
  setSortBy: ((sortType: SortType, dir: SortState) => unknown) | null
  loadMoreSubjects?: (() => unknown) | null
  loadMoreCollections?: (() => unknown) | null
  loadMoreResources?: (() => unknown) | null
  loadMorePeople?: (() => unknown) | null
}
export const Browser = withCtrl<BrowserProps>(
  ({
    subjectCardPropsList,
    collectionCardPropsList,
    resourceCardPropsList,
    smallProfileCardPropsList,
    setSortBy,
    loadMoreSubjects,
    loadMoreCollections,
    loadMoreResources,
    loadMorePeople,
  }) => {
    const [filters, setFilter] = useReducer(
      (prev: Record<FilterType, boolean>, [type, checked]: readonly [FilterType, boolean]) => ({
        ...prev,
        [type]: checked,
      }),
      {
        Subjects: subjectCardPropsList !== null,
        Collections: !collectionCardPropsList !== null,
        Resources: !resourceCardPropsList !== null,
        People: !smallProfileCardPropsList !== null,
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

    const singleActiveFilter = useCallback((): FilterType | undefined => {
      let numActiveFilters = 0
      let activeFilter
      filterTypes.forEach((filterType: FilterType) => {
        console.log(filterType + ' ' + filters[filterType])
        if (filters[filterType]) {
          numActiveFilters++
          activeFilter = filterType
        }
      }, [])
      return numActiveFilters === 1 ? activeFilter : undefined
    }, [filters])

    const loadMore = useMemo<(() => unknown) | null | undefined>(() => {
      const activeFilter = singleActiveFilter()
      switch (activeFilter) {
        case 'Subjects': {
          return loadMoreSubjects
        }
        case 'Collections': {
          return loadMoreCollections
        }
        case 'Resources': {
          return loadMoreResources
        }
        case 'People': {
          return loadMorePeople
        }
        default: {
          return null
        }
      }
    }, [loadMoreCollections, loadMorePeople, loadMoreResources, loadMoreSubjects, singleActiveFilter])

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
              label={t`Subjects`}
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
          smallProfileCardPropsList && (
            <Checkbox onChange={setFilterCB} label={t`People`} name="People" key="People" checked={filters.People} />
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
                title={
                  <div className="card-header">
                    <div className="title">
                      <Trans>Subjects</Trans>
                    </div>
                    {shouldShowSeeAll('Subjects') && (
                      <SecondaryButton onClick={() => seeAll('Subjects')}>
                        <Trans>See all</Trans>
                      </SecondaryButton>
                    )}
                  </div>
                }
                className={`subjects ${!shouldShowSeeAll('Subjects') ? 'see-all' : ''}`}
                noCard={true}
              />
            )}
            {collectionCardPropsList && filters.Collections && (
              <ListCard
                content={(shouldShowSeeAll('Collections')
                  ? collectionCardPropsList.slice(0, 6)
                  : collectionCardPropsList
                ).map(collectionCardProps => (
                  <CollectionCard {...collectionCardProps} />
                ))}
                title={
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
                }
                className={`collections ${!shouldShowSeeAll('Collections') ? 'see-all' : ''}`}
                noCard={true}
                minGrid={240}
              />
            )}
            {resourceCardPropsList && filters.Resources && (
              <ListCard
                content={(shouldShowSeeAll('Resources')
                  ? resourceCardPropsList.slice(0, 6)
                  : resourceCardPropsList
                ).map(resourceCardProps => (
                  <ResourceCard {...resourceCardProps} />
                ))}
                title={
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
                }
                className={`resources ${!shouldShowSeeAll('Resources') ? 'see-all' : ''}`}
                noCard={true}
                minGrid={280}
              />
            )}
            {smallProfileCardPropsList && filters.People && (
              <ListCard
                content={(shouldShowSeeAll('People')
                  ? smallProfileCardPropsList.slice(0, 11)
                  : smallProfileCardPropsList
                ).map(smallProfileCardProps => (
                  <SmallProfileCard {...smallProfileCardProps} />
                ))}
                title={
                  <div className="card-header">
                    <div className="title">
                      <Trans>People</Trans>
                    </div>
                    {shouldShowSeeAll('People') && (
                      <SecondaryButton onClick={() => seeAll('People')}>
                        <Trans>See all</Trans>
                      </SecondaryButton>
                    )}
                  </div>
                }
                className={`people ${!shouldShowSeeAll('People') ? 'see-all' : ''}`}
                noCard={true}
                minGrid={160}
              />
            )}
            {loadMore && (
              <div className="load-more">
                <SecondaryButton onClick={loadMore}>
                  <Trans>Load more</Trans>
                </SecondaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
)
Browser.displayName = 'BrowserPage'
