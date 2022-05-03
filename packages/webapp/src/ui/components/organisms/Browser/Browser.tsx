import { t, Trans } from '@lingui/macro'
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { CP, withCtrl } from '../../../lib/ctrl'
import Checkbox from '../../atoms/Checkbox/Checkbox'
import SecondaryButton from '../../atoms/SecondaryButton/SecondaryButton'
import {
  CollectionCard,
  CollectionCardProps,
} from '../../molecules/cards/CollectionCard/CollectionCard'
import FilterCard, {
  FilterCardDirection,
} from '../../molecules/cards/FilterCard/FilterCard'
import ListCard from '../../molecules/cards/ListCard/ListCard'
import {
  ResourceCard,
  ResourceCardProps,
} from '../../molecules/cards/ResourceCard/ResourceCard'
import {
  SmallProfileCard,
  SmallProfileCardProps,
} from '../../molecules/cards/SmallProfileCard/SmallProfileCard'
import { SortState } from '../../molecules/cards/SortCard/SortButton/SortButton'
import SortCard, {
  SortCardDirection,
} from '../../molecules/cards/SortCard/SortCard'
import SubjectCard, {
  SubjectCardProps,
} from '../../molecules/cards/SubjectCard/SubjectCard'
import './styles.scss'

export const filterTypes = [
  'Subjects',
  'Collections',
  'Resources',
  'People',
] as const
export type FilterType = typeof filterTypes[number]
type SortType = 'Relevance' | 'Recent' | 'Popularity'
export type BrowserProps = {
  subjectCardPropsList: CP<SubjectCardProps>[] | null
  collectionCardPropsList: CP<CollectionCardProps>[] | null
  resourceCardPropsList: CP<ResourceCardProps>[] | null
  smallProfileCardPropsList: CP<SmallProfileCardProps>[] | null
  hideSortAndFilter?: boolean
  peopleTitle?: string | null
  title?: string
  setSortBy: ((sortType: SortType, dir: SortState) => unknown) | null
  setFilters: ((showTypes: Record<FilterType, boolean>) => unknown) | null
  initialFilters?: Record<FilterType, boolean>
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
    hideSortAndFilter,
    peopleTitle,
    title,
    setSortBy,
    loadMoreSubjects,
    loadMoreCollections,
    loadMoreResources,
    loadMorePeople,
    setFilters,
    initialFilters,
  }) => {
    const [filters, setFilter] = useReducer(
      (
        prev: Record<FilterType, boolean>,
        [type, checked]: readonly [FilterType, boolean]
      ) => ({
        ...prev,
        [type]: checked,
      }),
      initialFilters ?? {
        Subjects: subjectCardPropsList ? true : false,
        Collections: collectionCardPropsList ? true : false,
        Resources: resourceCardPropsList ? true : false,
        People: smallProfileCardPropsList ? true : false,
      }
    )
    useEffect(() => {
      setFilters?.(filters)
    }, [filters, setFilters])
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
    }, [
      loadMoreCollections,
      loadMorePeople,
      loadMoreResources,
      loadMoreSubjects,
      singleActiveFilter,
    ])

    const setFilterCB = useCallback<ChangeEventHandler<HTMLInputElement>>(
      (ev) => {
        setFilter([
          ev.currentTarget.name as FilterType,
          ev.currentTarget.checked,
        ])
      },
      []
    )

    const filterCard = (direction: FilterCardDirection) => (
      <FilterCard
        className="filter"
        title={t`Filters`}
        direction={direction}
        content={[
          resourceCardPropsList && (
            <Checkbox
              onChange={setFilterCB}
              label={t`Resources`}
              name="Resources"
              key="Resources"
              checked={filters.Resources}
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
          subjectCardPropsList && (
            <Checkbox
              onChange={setFilterCB}
              label={t`Subjects`}
              name="Subjects"
              key="Subjects"
              checked={filters.Subjects}
            />
          ),
          smallProfileCardPropsList && (
            <Checkbox
              onChange={setFilterCB}
              label={t`People`}
              name="People"
              key="People"
              checked={filters.People}
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
        {title && <div className="title">{title}</div>}
        <div className="content">
          {!hideSortAndFilter && (
            <div className="side-column">
              {filterCard('vertical')}
              {sortCard('vertical')}
            </div>
          )}
          <div
            className={`main-column ${hideSortAndFilter ? 'full-width' : ''}`}
          >
            {!hideSortAndFilter && (
              <div className="filter-and-sort">
                {filterCard('horizontal')}
                {sortCard('horizontal')}
              </div>
            )}

            {resourceCardPropsList && filters.Resources && (
              <ListCard
                content={(shouldShowSeeAll('Resources')
                  ? resourceCardPropsList.slice(0, 6)
                  : resourceCardPropsList
                ).map((resourceCardProps) => (
                  <ResourceCard {...resourceCardProps} orientation="vertical" />
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
                className={`resources ${
                  !shouldShowSeeAll('Resources') ? 'see-all' : ''
                }`}
                noCard={true}
                minGrid={245}
              />
            )}

            {collectionCardPropsList && filters.Collections && (
              <ListCard
                content={(shouldShowSeeAll('Collections')
                  ? collectionCardPropsList.slice(0, 6)
                  : collectionCardPropsList
                ).map((collectionCardProps) => (
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
                className={`collections ${
                  !shouldShowSeeAll('Collections') ? 'see-all' : ''
                }`}
                noCard={true}
                minGrid={240}
              />
            )}

            {subjectCardPropsList && filters.Subjects && (
              <ListCard
                content={(shouldShowSeeAll('Subjects')
                  ? subjectCardPropsList.slice(0, 8)
                  : subjectCardPropsList
                ).map((subjectCardProps) => (
                  <SubjectCard {...subjectCardProps} />
                ))}
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
                className={`subjects ${
                  !shouldShowSeeAll('Subjects') ? 'see-all' : ''
                }`}
                noCard={true}
                direction="wrap"
              />
            )}

            {smallProfileCardPropsList && filters.People && (
              <ListCard
                content={(shouldShowSeeAll('People')
                  ? smallProfileCardPropsList.slice(0, 11)
                  : smallProfileCardPropsList
                ).map((smallProfileCardProps) => (
                  <SmallProfileCard {...smallProfileCardProps} />
                ))}
                title={
                  peopleTitle !== null && (
                    <div className="card-header">
                      <div className="title">
                        {peopleTitle ? (
                          t`${peopleTitle}`
                        ) : (
                          <Trans>People</Trans>
                        )}
                      </div>
                      {shouldShowSeeAll('People') && (
                        <SecondaryButton onClick={() => seeAll('People')}>
                          <Trans>See all</Trans>
                        </SecondaryButton>
                      )}
                    </div>
                  )
                }
                className={`people ${
                  !shouldShowSeeAll('People') ? 'see-all' : ''
                }`}
                noCard={true}
                minGrid={160}
              />
            )}
            {loadMore && (
              <div className="load-more">
                <SecondaryButton onClick={loadMore} color="grey">
                  <Trans>Load more</Trans>
                </SecondaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
Browser.displayName = 'BrowserPage'
