import type { AddonItem } from '@moodlenet/component-library'
import { SecondaryButton, SimpleDropdown } from '@moodlenet/component-library'
import type { ComponentType, FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import './Browser.scss'

export type BrowserMainColumnItemBase = {
  showAll: boolean
  setShowAll(): void
  showHeader?: boolean
}

export type MainColumItem = {
  Item: ComponentType<BrowserMainColumnItemBase>
  name: string
  filters: AddonItem[]
  numElements: number // the amount of elements in the Item list
  key: string
}

export type BrowserProps = BrowserPropsData & BrowserPropsUI

export type BrowserPropsData = {
  mainColumnItems: MainColumItem[]
}

export type BrowserPropsUI = {
  showFilters?: boolean
  title?: string
}

export const Browser: FC<BrowserProps> = ({ mainColumnItems, title, showFilters }) => {
  const mainColumnRef = useRef<HTMLDivElement>(null)
  const [currentMainFilter, setCurrentMainFilter] = useState<string | number | undefined>(undefined)

  const filteredMainColumItems = mainColumnItems?.filter(e => e.numElements !== 0)

  const filterByItemType = useMemo(() => {
    return filteredMainColumItems
      ? filteredMainColumItems
          .map(e => {
            if (e.numElements === 0) return null
            const isCurrent = e.key === currentMainFilter

            const list = filteredMainColumItems.map(i => {
              return { name: i.name, key: i.key }
            })
            list.push({ name: 'All', key: 'all' })

            return isCurrent || !currentMainFilter ? (
              isCurrent ? (
                <SimpleDropdown
                  list={list}
                  selected={[e.key]}
                  label={e.name}
                  onClick={(key: string | number) => {
                    setCurrentMainFilter(key === 'all' ? undefined : key)
                  }}
                />
              ) : (
                <SecondaryButton
                  key={e.key}
                  className={`filter-element ${isCurrent ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentMainFilter(e.key)
                  }}
                  color="grey"
                >
                  <span>{e.name}</span>
                </SecondaryButton>
              )
            ) : null
          })
          .filter(item => !!item)
      : []
  }, [filteredMainColumItems, currentMainFilter])

  const [currentFilters, setCurrentFilters] = useState<AddonItem[] | undefined>([])
  useEffect(() => {
    filteredMainColumItems?.map(e => e.key === currentMainFilter && setCurrentFilters(e.filters))
  }, [currentMainFilter, filteredMainColumItems])

  const filters =
    currentFilters && currentFilters.length > 0 ? (
      <div className="filters">
        {currentFilters.map(i => (
          <i.Item key={i.key} />
        ))}
      </div>
    ) : null

  const updatedMainColumnItems = [...(filteredMainColumItems ?? [])].filter(
    (item): item is MainColumItem /* | JSX.Element */ => !!item,
  )

  // scroll to top when changing the main filter
  useEffect(() => {
    document.body.scrollTo(0, 0)
  }, [currentMainFilter])

  const extraFilters =
    currentMainFilter && currentFilters && currentFilters.length > 0 ? (
      <>
        {/* <div className="separator" /> */}
        {filters}
        {/* <div className="separator"></div>
        <SecondaryButton className={`filter-element`} color="grey">
          All filters
        </SecondaryButton> */}
        {/* <TertiaryButton onClick={() => setCurrentMainFilter(undefined)}>Reset</TertiaryButton> */}
      </>
    ) : null

  return (
    <div className={`browser ${showFilters ? 'show-filters' : ''}`}>
      {showFilters && (
        <div className="filter-bar">
          <div className="filter-bar-content">
            <div className="content-type-filters">{filterByItemType.filter(e => !!e)}</div>
            {extraFilters}
          </div>
        </div>
      )}
      <div className="content">
        <div className={`main-column ${currentMainFilter ? 'full-width' : ''}`} ref={mainColumnRef}>
          {title && <div className="title">{title}</div>}
          {useMemo(
            () =>
              updatedMainColumnItems.map(i =>
                !currentMainFilter || i.key === currentMainFilter ? (
                  'Item' in i ? (
                    <i.Item
                      key={i.key}
                      showAll={i.key === currentMainFilter || filteredMainColumItems?.length === 1}
                      setShowAll={() => setCurrentMainFilter(i.key)}
                      showHeader={filteredMainColumItems?.length > 1}
                    />
                  ) : (
                    i
                  )
                ) : null,
              ),
            [updatedMainColumnItems, currentMainFilter, filteredMainColumItems?.length],
          )}
        </div>
      </div>
    </div>
  )
}

Browser.defaultProps = { showFilters: true }
Browser.displayName = 'Browser'

export default Browser
