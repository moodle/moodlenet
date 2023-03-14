import { AddonItem, Card } from '@moodlenet/component-library'
import { FC, ReactNode, useMemo, useState } from 'react'
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

  const navMenuElements = useMemo(
    () =>
      mainColumnItems
        ? mainColumnItems
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
            .filter(item => !!item)
        : [],
    [mainColumnItems, currentSection],
  )

  const navMenu = (
    <div className="nav-menu" role="navigation" key="nav-menu">
      <Card role="navigation">{navMenuElements}</Card>
    </div>
  )

  const updatedSideColumnItems = [navMenu, ...(sideColumnItems ?? [])].filter(
    (item): item is AddonItem | JSX.Element => !!item,
  )

  const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  return (
    <div className="browser">
      <div className="content">
        <div className="side-column">
          {useMemo(
            () => updatedSideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i)),
            [updatedSideColumnItems],
          )}
        </div>
        <div className="main-column">
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
