import { AddonItem, Card } from '@moodlenet/component-library'
import {
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

export type BrowserProps = {
  mainColumnItems?: ({ menuItem?: AddonItem } & AddonItem)[]
  sideColumnItems?: AddonItem[]
  children?: ReactNode
}

export const Browser: FC<BrowserProps> = ({ mainColumnItems, sideColumnItems }) => {
  const [currentSection, setCurrentSection] = useState(
    mainColumnItems && mainColumnItems.length > 0 ? mainColumnItems[0]?.key.toString() : '0',
  )
  const [heights, setHeights] = useState<number[]>([])
  const [navigating, setNavigating] = useState(false) // no avoid nav section buttons be active after selection
  const mainColumnRef = useRef<HTMLDivElement>(null)

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
              const isCurrent = e.key.toString() === currentSection

              return e.menuItem ? (
                <div
                  key={e.key}
                  className={`section ${isCurrent ? 'selected' : ''}`}
                  onClick={() => navigateToSection(idx, e.key.toString())}
                >
                  <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
                    <div className={`border ${isCurrent ? 'selected' : ''}`} />
                  </div>
                  <div className={`content ${isCurrent ? 'selected' : ''}`}>
                    {<e.menuItem.Item />}
                  </div>
                </div>
              ) : null
            })
            .filter(item => !!item)
        : [],
    [mainColumnItems, currentSection, navigateToSection],
  )

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

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  const updateActiveSection = useCallback(() => {
    const initialHeight = heights[0]
    const scrollTop =
      (initialHeight ? document.body.scrollTop + initialHeight : document.body.scrollTop) + 200

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
  }, [heights, updatedMainColumnItems, navigating])

  useEffect(() => {
    const parent = mainColumnRef.current
    const children = mainColumnRef.current?.children

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
      setHeights(heights)
    }
  }, [])

  // add the scroll listener to the window
  useLayoutEffect(() => {
    document.body.addEventListener('scroll', updateActiveSection)
    return () => {
      document.body.removeEventListener('scroll', updateActiveSection)
    }
  }, [updateActiveSection])

  return (
    <div className="browser">
      <div className="content">
        <div className="side-column">
          {useMemo(
            () => updatedSideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i)),
            [updatedSideColumnItems],
          )}
        </div>
        <div className="main-column" ref={mainColumnRef}>
          {useMemo(
            () => updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i)),
            [updatedMainColumnItems],
          )}
        </div>
      </div>
    </div>
  )
}

Browser.defaultProps = {}
Browser.displayName = 'Browser'

export default Browser
