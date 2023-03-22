import {
  AddonItem,
  Card,
  FloatingMenu,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import { ArrowDropDown } from '@mui/icons-material'
import {
  ComponentType,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import './Browser.scss'

export type MainColumItem = {
  Item: ComponentType<{
    showAll: boolean
    setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
  }>
  key: number | string
  menuItem?: ComponentType
}

export type BrowserProps = {
  mainColumnItems?: MainColumItem[]
  sideColumnItems?: AddonItem[]
  filterBarItems?: AddonItem[]
  children?: ReactNode
}

export const Browser: FC<BrowserProps> = ({ mainColumnItems, sideColumnItems, filterBarItems }) => {
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

              return e.menuItem ? (
                <div
                  key={e.key}
                  className={`section ${isCurrent ? 'selected' : ''}`}
                  onClick={() => {
                    currentMainFilter
                      ? setCurrentMainFilter(e.key.toString())
                      : navigateToSection(idx, e.key.toString())
                  }}
                >
                  <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
                    <div className={`border ${isCurrent ? 'selected' : ''}`} />
                  </div>
                  <div className={`content ${isCurrent ? 'selected' : ''}`}>{<e.menuItem />}</div>
                </div>
              ) : null
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

  const navMenu = (
    <div className="nav-menu" role="navigation" key="nav-menu">
      <Card className="navigation-card" role="navigation">
        {navMenuElements}
      </Card>
    </div>
  )

  const updatedSideColumnItems = [navMenu, ...(sideColumnItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const updatedFilterBarItems = [...filterByItemType, ...(filterBarItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element */ => !!item,
  )

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is MainColumItem /* | JSX.Element */ => !!item,
  )

  // update the current section while scrolling
  const updateActiveSection = useCallback(() => {
    const initialHeight = heights[0]
    const body = document.body
    const scrollTop = (initialHeight ? body.scrollTop + initialHeight : body.scrollTop) + 200

    // find and select current section while scrolling
    for (let i = 0; i < heights.length; i++) {
      const currentHeight = heights[i]
      const nextHeight = heights[i + 1]
      const topCondition = currentHeight && currentHeight < scrollTop
      const bottomCondition = i < heights.length - 1 ? nextHeight && scrollTop < nextHeight : true
      if (topCondition && bottomCondition) {
        !navigating && setCurrentSection(updatedMainColumnItems[i]?.key.toString())
        break
      }
    }

    // select the last section when on the bottom of the screen
    const mainLayoutDiv = document.querySelector('.layout-container > .main-layout')
    const bodyScrollTop = body.scrollTop

    if (mainLayoutDiv && window.innerHeight + bodyScrollTop >= mainLayoutDiv.clientHeight) {
      const lastItem = updatedMainColumnItems[updatedMainColumnItems.length - 1]
      setCurrentSection(lastItem?.key.toString())
    }
  }, [heights, updatedMainColumnItems, navigating])

  // add the scroll listener to the window
  useLayoutEffect(() => {
    document.body.addEventListener('scroll', updateActiveSection)
    return () => {
      document.body.removeEventListener('scroll', updateActiveSection)
    }
  }, [updateActiveSection])

  const sideColumnElements = useMemo(
    () => updatedSideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i)),
    [updatedSideColumnItems],
  )

  // scroll to top when changing the main filter
  useEffect(() => {
    document.body.scrollTo(0, 0)
  }, [currentMainFilter])

  return (
    <div className="browser">
      <div className="filter-bar">
        <div className="filter-bar-content">
          {useMemo(
            () => updatedFilterBarItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i)),
            [updatedFilterBarItems],
          )}
        </div>
      </div>
      <div className="content">
        {!currentMainFilter && <div className="side-column">{sideColumnElements}</div>}
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
