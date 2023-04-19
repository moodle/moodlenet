import {
  AddonItem,
  FloatingMenu,
  PrimaryButton,
  SecondaryButton,
} from '@moodlenet/component-library'
import { ArrowDropDown } from '@mui/icons-material'
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from 'react'
import './Browser.scss'
import { getFilterContentDefaultListElement } from './Filter.js'

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
  mainColumnItems?: MainColumItem[]
}

export const Browser: FC<BrowserProps> = ({ mainColumnItems }) => {
  const mainColumnRef = useRef<HTMLDivElement>(null)
  const [currentMainFilter, setCurrentMainFilter] = useState<string | undefined>(undefined)

  const navMenuElements = useMemo(
    () =>
      mainColumnItems
        ? mainColumnItems
            .map(e => {
              const isCurrent = currentMainFilter ? e.key.toString() === currentMainFilter : false

              const onClick = () => setCurrentMainFilter(e.key.toString())

              return getFilterContentDefaultListElement({
                name: e.name,
                key: e.key,
                isCurrent,
                onClick,
              })
            })
            .filter(item => !!item)
        : [],
    [mainColumnItems, currentMainFilter],
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

            return isCurrent || !currentMainFilter ? (
              isCurrent ? (
                <FloatingMenu
                  className="menu-content-default-list"
                  hoverElement={
                    <PrimaryButton
                      key={e.key}
                      className={`filter-element ${isCurrent ? 'selected' : ''}`}
                    >
                      <span>{e.name}</span>
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
                  <div className={`content ${isCurrent ? 'selected' : ''}`}>
                    <span>{e.name}</span>
                  </div>
                </SecondaryButton>
              )
            ) : null
          })
          .filter(item => !!item)
      : []
  }, [mainColumnItems, currentMainFilter, navMenuElements, setCurrentMainFilter])

  const [currentFilters, setCurrentFilters] = useState<AddonItem[] | undefined>([])
  useEffect(() => {
    mainColumnItems?.map(
      e => e.key.toString() === currentMainFilter && setCurrentFilters(e.filters),
    )
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
