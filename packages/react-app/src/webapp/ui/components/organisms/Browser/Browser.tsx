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
  key: number | string
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
  const [currentMainFilter, setCurrentMainFilter] = useState<string | undefined>(undefined)

  const filterByItemType = useMemo(() => {
    return mainColumnItems
      ? mainColumnItems
          .map(e => {
            const isCurrent = e.name === currentMainFilter

            const list = mainColumnItems.map(i => i.name)
            list.push('All')

            return isCurrent || !currentMainFilter ? (
              isCurrent ? (
                <SimpleDropdown
                  list={list}
                  selected={[e.name]}
                  label={e.name}
                  onClick={name => setCurrentMainFilter(name === 'All' ? undefined : name)}
                />
              ) : (
                <SecondaryButton
                  key={e.key}
                  className={`filter-element ${isCurrent ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentMainFilter(e.name)
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
  }, [mainColumnItems, currentMainFilter, setCurrentMainFilter])

  const [currentFilters, setCurrentFilters] = useState<AddonItem[] | undefined>([])
  useEffect(() => {
    mainColumnItems?.map(e => e.name === currentMainFilter && setCurrentFilters(e.filters))
  }, [currentMainFilter, mainColumnItems])

  const filters =
    currentFilters && currentFilters.length > 0 ? (
      <div className="filters">
        {currentFilters.map(i => (
          <i.Item key={i.key} />
        ))}
      </div>
    ) : null

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
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

  // console.log('lenght ', mainColumnItems?.length)
  // console.log('lenght ', mainColumnItems?.length > 1)

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
                !currentMainFilter || i.name === currentMainFilter ? (
                  'Item' in i ? (
                    <i.Item
                      key={i.key}
                      showAll={i.name === currentMainFilter || mainColumnItems?.length === 1}
                      setShowAll={() => setCurrentMainFilter(i.name)}
                      showHeader={mainColumnItems?.length > 1}
                    />
                  ) : (
                    i
                  )
                ) : null,
              ),
            [updatedMainColumnItems, currentMainFilter, mainColumnItems?.length],
          )}
        </div>
      </div>
    </div>
  )
}

Browser.defaultProps = { showFilters: true }
Browser.displayName = 'Browser'

export default Browser
