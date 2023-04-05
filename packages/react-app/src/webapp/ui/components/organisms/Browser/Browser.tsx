import { FloatingMenu, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import { ArrowDropDown } from '@mui/icons-material'
import { ComponentType, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Browser.scss'
import { Filter, FilterProps, getFilterContentDefaultListElement } from './Filter.js'

export type MainColumItem = {
  Item: ComponentType<{
    showAll: boolean
    setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
  }>
  key: number | string
  menuItem?: ComponentType
  filters?: FilterProps[]
}

export type BrowserProps = {
  mainColumnItems?: MainColumItem[]
}

export const Browser: FC<BrowserProps> = ({ mainColumnItems }) => {
  const mainColumnRef = useRef<HTMLDivElement>(null)
  const [heights, setHeights] = useState<number[]>([])
  const [currentSection, setCurrentSection] = useState(
    mainColumnItems && mainColumnItems.length > 0 ? mainColumnItems[0]?.key.toString() : '0',
  )
  const [currentMainFilter, setCurrentMainFilter] = useState<string | undefined>(undefined)

  // find the heights of each section and set the current section
  useEffect(() => {
    const parent = mainColumnRef.current
    const children = mainColumnRef.current?.children

    if (!parent) return

    const observer = new ResizeObserver(() => {
      const heights = parent ? [parent.offsetTop] : [0]

      if (children) {
        for (let i = 0; i < children.length - 1; i++) {
          const child = children[i]
          const prevHeight = heights[i]
          const childHeight = child?.clientHeight
          const gap = Number((parent ? window.getComputedStyle(parent).gap : '').replace('px', ''))

          childHeight && heights.push(prevHeight ? childHeight + prevHeight + gap : childHeight)
          const currentHeight = heights[i]

          if (currentHeight && window.pageYOffset >= currentHeight) {
            const key = child?.getAttribute('key')
            key && setCurrentSection(key)
          }
        }
      }
      setHeights(heights)
    })

    observer.observe(parent)
    return () => {
      observer.disconnect()
    }
  }, [])

  const [navigating, setNavigating] = useState(false) // no avoid nav section buttons be active after selection

  // nvaigate to the section when the section button is clicked
  const navigateToSection = useCallback(
    (idx: number, key: string) => {
      setCurrentSection(key)
      setNavigating(true)
      const startHeight = heights[0]
      const height = heights[idx]
      if (height && startHeight) {
        document.body.scrollTop = height - startHeight
      }
      setTimeout(() => setNavigating(false), 200)
    },
    [heights],
  )

  const navMenuElements = useMemo(
    () =>
      mainColumnItems
        ? mainColumnItems
            .map((e, idx) => {
              const isCurrent = currentMainFilter
                ? e.key.toString() === currentMainFilter
                : e.key.toString() === currentSection

              const onClick = () =>
                currentMainFilter
                  ? setCurrentMainFilter(e.key.toString())
                  : navigateToSection(idx, e.key.toString())

              return e.menuItem
                ? getFilterContentDefaultListElement({
                    Item: e.menuItem,
                    key: e.key,
                    isCurrent,
                    onClick,
                  })
                : null
            })
            .filter(item => !!item)
        : [],
    [mainColumnItems, currentMainFilter, currentSection, navigateToSection],
  )

  const filterByItemType = useMemo(() => {
    const menuContent = [...navMenuElements.filter((item): item is JSX.Element => !!item)]
    menuContent.unshift(
      <div key="show-all" className={`section `} onClick={() => setCurrentMainFilter(undefined)}>
        <div className={`border-container`}>
          <div className={`border`} />
        </div>
        <div className={`content`}>
          <span>All</span>
        </div>
      </div>,
    )
    return mainColumnItems
      ? mainColumnItems
          .map(e => {
            const isCurrent = e.key.toString() === currentMainFilter

            return (isCurrent || !currentMainFilter) && e.menuItem ? (
              isCurrent ? (
                <FloatingMenu
                  className="menu-content-default-list"
                  hoverElement={
                    <PrimaryButton
                      key={e.key}
                      className={`filter-element ${isCurrent ? 'selected' : ''}`}
                    >
                      <e.menuItem />
                      <ArrowDropDown />
                    </PrimaryButton>
                  }
                  menuContent={menuContent}
                />
              ) : (
                <SecondaryButton
                  key={e.key}
                  className={`filter-element ${isCurrent ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentMainFilter(e.key.toString())
                  }}
                  color="grey"
                >
                  <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
                    <div className={`border ${isCurrent ? 'selected' : ''}`} />
                  </div>
                  <div className={`content ${isCurrent ? 'selected' : ''}`}>{<e.menuItem />}</div>
                </SecondaryButton>
              )
            ) : null
          })
          .filter(item => !!item)
      : []
  }, [mainColumnItems, currentMainFilter, navMenuElements, setCurrentMainFilter])

  const [currentFilters, setCurrentFilters] = useState<FilterProps[] | undefined>([])
  useEffect(() => {
    mainColumnItems?.map(
      e => e.key.toString() === currentMainFilter && setCurrentFilters(e.filters),
    )
  }, [currentMainFilter, mainColumnItems])

  const filters =
    currentFilters && currentFilters.length > 0 ? (
      <div className="filters">
        {currentFilters.map(i => (
          <Filter {...i} key={i.key} />
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

  console.log('extraFilters', extraFilters)

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
          {useMemo(
            () =>
              updatedMainColumnItems.map(i =>
                !currentMainFilter || i.key.toString() === currentMainFilter ? (
                  'Item' in i ? (
                    <i.Item
                      key={i.key}
                      showAll={i.key.toString() === currentMainFilter}
                      setShowAll={setCurrentMainFilter}
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
