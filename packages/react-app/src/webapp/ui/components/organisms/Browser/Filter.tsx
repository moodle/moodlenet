import { ArrowDropDown } from '@material-ui/icons'
import { FloatingMenu, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import { ComponentType } from 'react'

export type FilterItem = {
  name: string
  menuContent: React.ReactElement[] | React.ReactElement
  menuContentType?: 'menu-content-default-list' | string
  key: number | string
}

export const getFilterElement = (filter: FilterItem, isUsed?: boolean): JSX.Element => {
  return (
    <FloatingMenu
      key={filter.key}
      className={`${filter.menuContentType}`}
      hoverElement={
        isUsed ? (
          <PrimaryButton className={`filter-element ${isUsed ? 'selected' : ''}`}>
            {filter.name}
            <ArrowDropDown />
          </PrimaryButton>
        ) : (
          <SecondaryButton className={`filter-element ${isUsed ? 'selected' : ''}`} color="grey">
            {filter.name}
            <ArrowDropDown />
          </SecondaryButton>
        )
      }
      menuContent={filter.menuContent}
    />
  )
}

export const getFilterContentDefaultListElement = (element: {
  Item: ComponentType
  key: string | number
  onClick?: () => unknown
  isCurrent?: boolean
}) => {
  const { Item, key, isCurrent, onClick } = element
  return (
    <div
      key={key}
      className={`section ${isCurrent ? 'selected' : ''}`}
      onClick={element.onClick && onClick}
    >
      <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
        <div className={`border ${isCurrent ? 'selected' : ''}`} />
      </div>
      <div className={`content ${isCurrent ? 'selected' : ''}`}>{<Item />}</div>
    </div>
  )
}
