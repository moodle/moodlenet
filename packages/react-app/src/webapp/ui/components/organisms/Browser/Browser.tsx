import { AddonItem } from '@moodlenet/component-library'
import { FC } from 'react'
import './Browser.scss'

export const filterTypes = ['Subjects', 'Collections', 'Resources', 'People'] as const
export type FilterType = typeof filterTypes[number]
// type SortType = 'Relevance' | 'Recent' | 'Popularity'
export type BrowserProps = {
  mainColumnItems?: AddonItem[]
  //   subjectCardPropsList: SubjectCardProps[] | null
  //   collectionCardPropsList: CollectionCardProps[] | null
  //   resourceCardPropsList: CP<ResourceCardProps>[] | null
  //   smallProfileCardPropsList: CP<SmallProfileCardProps>[] | null
  //   hideSortAndFilter?: boolean
  //   peopleTitle?: string | null
  //   title?: string
  //   setSortBy: ((sortType: SortType, dir: SortState) => unknown) | null
  //   setFilters: ((showTypes: Record<FilterType, boolean>) => unknown) | null
  //   initialFilters?: Record<FilterType, boolean>
  //   loadMoreSubjects?: (() => unknown) | null
  //   loadMoreCollections?: (() => unknown) | null
  //   loadMoreResources?: (() => unknown) | null
  //   loadMorePeople?: (() => unknown) | null
}
export const Browser: FC<BrowserProps> = ({
  // subjectCardPropsList,
  // collectionCardPropsList,
  // resourceCardPropsList,
  // smallProfileCardPropsList,
  mainColumnItems,
  // hideSortAndFilter,
  // peopleTitle,
  // title,
  // setSortBy,
  // loadMoreSubjects,
  // loadMoreCollections,
  // loadMoreResources,
  // loadMorePeople,
  // setFilters,
  // initialFilters,
}) => {
  // const [filters, setFilter] = useReducer(
  //   (
  //     prev: Record<FilterType, boolean>,
  //     [type, checked]: readonly [FilterType, boolean]
  //   ) => ({
  //     ...prev,
  //     [type]: checked,
  //   }),
  //   initialFilters ?? {
  //     Subjects: subjectCardPropsList ? true : false,
  //     Collections: collectionCardPropsList ? true : false,
  //     Resources: resourceCardPropsList ? true : false,
  //     People: smallProfileCardPropsList ? true : false,
  //   }
  // )

  // useEffect(() => {
  //   setFilters?.(filters)
  // }, [filters, setFilters])

  // useEffect(() => {
  //   let counter = 0
  //   filterTypes.forEach(
  //     (filterType: FilterType) => filters[filterType] && counter++,
  //     []
  //   )
  //   setSeeAll(counter === 1 ? true : false)
  // }, [filters])

  // const [seeAll, setSeeAll] = useState<boolean>(false)

  // const activateSeeAll = (type: FilterType) => {
  //   setSeeAll(true)
  //   filterTypes.forEach((filterType: FilterType) => {
  //     filterType !== type && setFilter([filterType, false])
  //   })
  // }

  // const singleActiveFilter = useCallback((): FilterType | undefined => {
  //   let numActiveFilters = 0
  //   let activeFilter
  //   filterTypes.forEach((filterType: FilterType) => {
  //     if (filters[filterType]) {
  //       numActiveFilters++
  //       activeFilter = filterType
  //     }
  //   }, [])
  //   return numActiveFilters === 1 ? activeFilter : undefined
  // }, [filters])

  // const loadMore = useMemo<(() => unknown) | null | undefined>(() => {
  //   const activeFilter = singleActiveFilter()
  //   switch (activeFilter) {
  //     case 'Subjects': {
  //       return loadMoreSubjects
  //     }
  //     case 'Collections': {
  //       return loadMoreCollections
  //     }
  //     case 'Resources': {
  //       return loadMoreResources
  //     }
  //     case 'People': {
  //       return loadMorePeople
  //     }
  //     default: {
  //       return null
  //     }
  //   }
  // }, [
  //   loadMoreCollections,
  //   loadMorePeople,
  //   loadMoreResources,
  //   loadMoreSubjects,
  //   singleActiveFilter,
  // ])

  // const setFilterCB = useCallback<ChangeEventHandler<HTMLInputElement>>(
  //   (ev) => {
  //     setFilter([
  //       ev.currentTarget.name as FilterType,
  //       ev.currentTarget.checked,
  //     ])
  //   },
  //   []
  // )

  // const filterCard = (direction: FilterCardDirection) => (
  //   <FilterCard
  //     className="filter"
  //     title={t`Filters`}
  //     direction={direction}
  //     content={[
  //       resourceCardPropsList && (
  //         <Checkbox
  //           onChange={setFilterCB}
  //           label={t`Resources`}
  //           name="Resources"
  //           key="Resources"
  //           checked={filters.Resources}
  //           disabled={
  //             !resourceCardPropsList || resourceCardPropsList.length <= 0
  //           }
  //         />
  //       ),
  //       collectionCardPropsList && (
  //         <Checkbox
  //           onChange={setFilterCB}
  //           label={t`Collections`}
  //           name="Collections"
  //           key="Collections"
  //           checked={filters.Collections}
  //           disabled={
  //             !collectionCardPropsList || collectionCardPropsList.length <= 0
  //           }
  //         />
  //       ),
  //       subjectCardPropsList && (
  //         <Checkbox
  //           onChange={setFilterCB}
  //           label={t`Subjects`}
  //           name="Subjects"
  //           key="Subjects"
  //           checked={filters.Subjects}
  //           disabled={
  //             !subjectCardPropsList || subjectCardPropsList.length <= 0
  //           }
  //         />
  //       ),
  //       smallProfileCardPropsList && (
  //         <Checkbox
  //           onChange={setFilterCB}
  //           label={t`People`}
  //           name="People"
  //           key="People"
  //           checked={filters.People}
  //           disabled={
  //             !smallProfileCardPropsList ||
  //             smallProfileCardPropsList.length <= 0
  //           }
  //         />
  //       ),
  //     ]}
  //   />
  // )

  // const sortCard = (direction: SortCardDirection) =>
  //   setSortBy && (
  //     <SortCard
  //       className="sort"
  //       title={t`Sort`}
  //       direction={direction}
  //       content={[
  //         ['Relevance', t`Relevance`, 'inactive'],
  //         ['Recent', t`Recent`, 'more'],
  //         ['Popularity', t`Popularity`, 'inactive'],
  //       ]}
  //       onChange={setSortBy}
  //     />
  //   )

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element  */ => !!item,
  )

  return (
    <div className="browser">
      <div className="content">
        {/* {!hideSortAndFilter && ( */}
        <div className="side-column">
          {/* {filterCard('vertical')} */}
          {/* {sortCard('vertical')} */}
        </div>
        {/* )} */}
        <div
          className={`main-column }`}
          // className={`main-column ${hideSortAndFilter ? 'full-width' : ''}`}
        >
          {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
          {/* {title && <div className="title">{title}</div>}
            {!hideSortAndFilter && (
              <div className="filter-and-sort">
                {filterCard('horizontal')}
                {sortCard('horizontal')}
              </div>
            )}

            {resourceCardPropsList &&
              resourceCardPropsList.length > 0 &&
              filters.Resources && (
                <ListCard
                  content={(seeAll
                    ? resourceCardPropsList
                    : resourceCardPropsList.slice(0, 6)
                  ).map((resourceCardProps) => (
                    <ResourceCard
                      {...resourceCardProps}
                      orientation="vertical"
                    />
                  ))}
                  title={
                    <div className="card-header">
                      <div className="title">
                        <Trans>Resources</Trans>
                      </div>
                      {!seeAll && (
                        <SecondaryButton
                          onClick={() => activateSeeAll('Resources')}
                          color="dark-blue"
                        >
                          <Trans>See all</Trans>
                        </SecondaryButton>
                      )}
                    </div>
                  }
                  className={`resources ${seeAll ? 'see-all' : ''}`}
                  noCard={true}
                  minGrid={245}
                  maxHeight={seeAll ? undefined : 736}
                  // maxRows={seeAll ? undefined : 2}
                />
              )}

            {collectionCardPropsList &&
              collectionCardPropsList.length > 0 &&
              filters.Collections && (
                <ListCard
                  content={(seeAll
                    ? collectionCardPropsList
                    : collectionCardPropsList.slice(0, 6)
                  ).map((collectionCardProps) => (
                    <CollectionCard {...collectionCardProps} />
                  ))}
                  title={
                    <div className="card-header">
                      <div className="title">
                        <Trans>Collections</Trans>
                      </div>
                      {!seeAll && (
                        <SecondaryButton
                          onClick={() => activateSeeAll('Collections')}
                          color="dark-blue"
                        >
                          <Trans>See all</Trans>
                        </SecondaryButton>
                      )}
                    </div>
                  }
                  className={`collections ${seeAll ? 'see-all' : ''}`}
                  noCard={true}
                  minGrid={240}
                  maxHeight={seeAll ? undefined : 397}
                  // maxRows={seeAll ? undefined : 2}
                />
              )}

            {subjectCardPropsList &&
              subjectCardPropsList.length > 0 &&
              filters.Subjects && (
                <ListCard
                  content={(seeAll
                    ? subjectCardPropsList
                    : subjectCardPropsList.slice(0, 8)
                  ).map((subjectCardProps) => (
                    <SubjectCard {...subjectCardProps} />
                  ))}
                  title={
                    <div className="card-header">
                      <div className="title">
                        <Trans>Subjects</Trans>
                      </div>
                      {!seeAll && (
                        <SecondaryButton
                          onClick={() => activateSeeAll('Subjects')}
                          color="dark-blue"
                        >
                          <Trans>See all</Trans>
                        </SecondaryButton>
                      )}
                    </div>
                  }
                  className={`subjects ${seeAll ? 'see-all' : ''}`}
                  noCard={true}
                  direction="wrap"
                  maxHeight={seeAll ? undefined : 221}
                  // maxRows={seeAll ? undefined : 2}
                />
              )}

            {smallProfileCardPropsList &&
              smallProfileCardPropsList.length > 0 &&
              filters.People && (
                <ListCard
                  content={(seeAll
                    ? smallProfileCardPropsList
                    : smallProfileCardPropsList.slice(0, 11)
                  ).map((smallProfileCardProps) => (
                    <SmallProfileCard {...smallProfileCardProps} />
                  ))}
                  title={
                    peopleTitle !== null && (
                      <div className="card-header">
                        <div className="title">
                          {peopleTitle ? peopleTitle : <Trans>People</Trans>}
                        </div>
                        {!seeAll && (
                          <SecondaryButton
                            onClick={() => activateSeeAll('People')}
                          >
                            <Trans>See all</Trans>
                          </SecondaryButton>
                        )}
                      </div>
                    )
                  }
                  className={`people ${seeAll ? 'see-all' : ''}`}
                  noCard={true}
                  minGrid={160}
                  maxHeight={seeAll ? undefined : 535}
                  // maxRows={seeAll ? undefined : 2}
                />
              )}
            {loadMore && (
              <div className="load-more">
                <SecondaryButton onClick={loadMore} color="grey">
                  <Trans>Load more</Trans>
                </SecondaryButton>
              </div>
            )} */}
        </div>
      </div>
    </div>
  )
}
Browser.displayName = 'BrowserPage'
