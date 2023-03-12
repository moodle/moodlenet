import { AddonItem, Card } from '@moodlenet/component-library'
import { FC, useEffect, useRef, useState } from 'react'
import './Browser.scss'

export const filterTypes = ['Subjects', 'Collections', 'Resources', 'People'] as const
export type FilterType = typeof filterTypes[number]
// type SortType = 'Relevance' | 'Recent' | 'Popularity'
export type BrowserProps = {
  mainColumnItems?: ({ menuItem?: AddonItem } & AddonItem)[]
  sideColumnItems?: AddonItem[]
}
export const Browser: FC<BrowserProps> = ({ mainColumnItems, sideColumnItems }) => {
  const [currentSection, setCurrentSection] = useState(
    mainColumnItems && mainColumnItems.length > 0 ? mainColumnItems[0]?.key.toString() : '0',
  )

  const navMenu = (
    <div className="nav-menu" role="navigation">
      <Card role="navigation">
        {mainColumnItems &&
          mainColumnItems
            .map(e => {
              const isCurrent = e.key.toString() === currentSection

              return e.menuItem ? (
                <div
                  key={e.key}
                  className={`section ${isCurrent ? 'selected' : ''}`}
                  onClick={() => setCurrentSection(e.key.toString())}
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
            .filter(item => !!item)}
      </Card>
    </div>
  )

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element  */ => !!item,
  )

  const updatedSideColumnItems = [navMenu, ...(sideColumnItems ?? [])].filter(
    (item): item is AddonItem /* | JSX.Element  */ => !!item,
  )

  const mainColumnRef = useRef<HTMLDivElement>(null)

  const mainColumnElements = updatedMainColumnItems.map(i =>
    'Item' in i ? <i.Item key={i.key} /> : i,
  )

  // const updateActiveSection = () => {
  //   console.log(
  //     'mainColumnRef.current',
  //     mainColumnRef.current,
  //     'children',
  //     mainColumnRef.current?.children,
  //     'length',
  //     mainColumnRef.current?.children?.length ?? '',
  //   )
  //   const children = mainColumnRef.current?.children
  //   if (children) {
  //     for (let i = 0; i < children.length; i++) {
  //       const section = children[i]
  //       const sectionTop = section?.clientTop
  //       if (sectionTop && window.pageYOffset >= sectionTop) {
  //         const key = section?.getAttribute('key')
  //         key && setCurrentSection(key)
  //       }
  //     }
  //   }
  // }

  // useEffect(() => {
  //   window.addEventListener('scroll', updateActiveSection)
  //   return () => window.removeEventListener('scroll', updateActiveSection)
  // }, [])

  // useEffect(() => {
  //   window.addEventListener('scroll', updateActiveSection)
  //   return () => {
  //     window.removeEventListener('scroll', updateActiveSection)
  //   }
  // }, [updateActiveSection])

  useEffect(() => {
    const a = mainColumnRef.current
    console.log(mainColumnRef.current?.children)
  }, [mainColumnRef])

  return (
    <div className="browser">
      <div className="content">
        {/* {!hideSortAndFilter && ( */}
        <div className="side-column">
          {updatedSideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
        </div>
        {/* )} */}
        <div ref={mainColumnRef} className={`main-column`}>
          {mainColumnElements}
        </div>
      </div>
    </div>
  )
}
Browser.displayName = 'BrowserPage'
