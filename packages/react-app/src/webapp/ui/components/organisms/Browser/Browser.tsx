import { AddonItem, SecondaryButton, SimpleDropdown } from '@moodlenet/component-library'
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from 'react'
import './Browser.scss'

export type MainColumItem = {
  Item: ComponentType<{
    showAll: boolean
    setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
  }>
  name: string
  filters: AddonItem[]
  key: number | string
}

export type BrowserProps = {
  mainColumnItems: MainColumItem[]
  title?: string
}

export const Browser: FC<BrowserProps> = ({ mainColumnItems, title }) => {
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

  return (
    <div className="browser">
      <div className="filter-bar">
        <div className="filter-bar-content">
          <div className="content-type-filters">{filterByItemType.filter(e => !!e)}</div>
          {extraFilters}
        </div>
      </div>
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
                      showAll={i.name === currentMainFilter}
                      setShowAll={() => setCurrentMainFilter(i.name)}
                    />
                  ) : (
                    i
                  )
                ) : null,
              ),
            [updatedMainColumnItems, currentMainFilter],
          )}
        </div>
      </div>
    </div>
  )
}

Browser.defaultProps = {}
Browser.displayName = 'Browser'

export default Browser
