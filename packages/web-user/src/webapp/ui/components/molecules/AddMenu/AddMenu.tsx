import { FloatingMenu } from '@moodlenet/component-library'
import { ComponentType, FC } from 'react'
import { ReactComponent as AddIcon } from '../../../assets/icons/add-round.svg'

export type AddMenuItem = {
  Component: ComponentType
  key: string | number
  className?: string
}
export type AddMenuProps = {
  menuItems: AddMenuItem[]
}

export const AddMenu: FC<AddMenuProps> = ({ menuItems }) => {
  return menuItems.length ? (
    <FloatingMenu
      className="add-menu"
      key="add-menu"
      abbr="Add content"
      menuContent={menuItems.map(({ Component, key, className = '' }) => {
        // reoderedmenuItems.map((menuItem, i) => {
        return (
          <div key={key} className={`add-menu-item ${className}`}>
            <Component />
          </div>
        )
      })}
      hoverElement={<AddIcon className="add-icon" tabIndex={0} />}
    />
  ) : null
}
