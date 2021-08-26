import { t, Trans } from '@lingui/macro'
import { ChangeEventHandler, useCallback, useReducer } from 'react'
import { CP, withCtrl } from '../../lib/ctrl'
import Checkbox from '../atoms/Checkbox/Checkbox'
import SecondaryButton from '../atoms/SecondaryButton/SecondaryButton'
import { CollectionCard, CollectionCardProps } from '../cards/CollectionCard/CollectionCard'
import FilterCard from '../cards/FilterCard/FilterCard'
import ListCard from '../cards/ListCard/ListCard'
import { ResourceCard, ResourceCardProps } from '../cards/ResourceCard/ResourceCard'
import { SortState } from '../cards/SortCard/SortButton/SortButton'
import SortCard from '../cards/SortCard/SortCard'
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
        Subjects: true,
        Collections: true,
        Resources: true,
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
      })
      return shouldShowSeeAll
    }

    const setFilterCB = useCallback<ChangeEventHandler<HTMLInputElement>>(ev => {
      setFilter([ev.currentTarget.name as FilterType, ev.currentTarget.checked])
    }, [])
    return (
      <div className="browser">
        <div className="content">
          <div className="side-column">
            <FilterCard
              className="filter"
              title={t`Filters`}
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
            {setSortBy && (
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
            )}
          </div>
          <div className="main-column">
            {subjectCardPropsList && filters.Subjects && (
              <ListCard
                content={subjectCardPropsList.slice(0, 8).map(subjectCardProps => (
                  <SubjectCard {...subjectCardProps} />
                ))}
                className="subjects"
                noCard={true}
              >
                <div className="card-header">
                  <div className="title">
                    <Trans>Categories</Trans>
                  </div>
                  { shouldShowSeeAll('Subjects') && <SecondaryButton onClick={() => seeAll('Subjects')}>
                    <Trans>See all</Trans>
                  </SecondaryButton>}
                </div>
              </ListCard>
            )}
            {collectionCardPropsList && filters.Collections && (
              <ListCard
                content={collectionCardPropsList.slice(0, 6).map(collectionCardProps => (
                  <CollectionCard {...collectionCardProps} />
                ))}
                className="collections"
                noCard={true}
              >
                <div className="card-header">
                  <div className="title">
                    <Trans>Collections</Trans>
                  </div>
                  { shouldShowSeeAll('Collections') && <SecondaryButton onClick={() => seeAll('Collections')}>
                    <Trans>See all</Trans>
                  </SecondaryButton>}
                </div>
              </ListCard>
            )}
            {resourceCardPropsList && filters.Resources && (
              <ListCard
                content={resourceCardPropsList.slice(0, 8).map(resourceCardProps => (
                  <ResourceCard {...resourceCardProps} />
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
    )
  },
)
Browser.displayName = 'BrowserPage'
