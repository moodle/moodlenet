import { FloatingMenu, FloatingMenuContentItem } from '@moodlenet/component-library'
import { ComponentType, FC, useMemo } from 'react'
import { ReactComponent as AddIcon } from '../../../assets/icons/add-round.svg'

export type AddMenuItem = {
  Component: ComponentType
  key: string
  className?: string
}
export type AddMenuProps = {
  menuItems: AddMenuItem[]
}

export const AddMenu: FC<AddMenuProps> = ({ menuItems }) => {
  const menuContent = useMemo(() => {
    return menuItems.map(({ Component, key, className = '' }) => {
      const floatingMenuContentItem: FloatingMenuContentItem = {
        Component,
        key,
        className: `add-menu-item ${className}`,
      }
      // reoderedmenuItems.map((menuItem, i) => {
      return floatingMenuContentItem
    })
  }, [menuItems])

  return menuItems.length ? (
    <FloatingMenu
      className="add-menu"
      key="add-menu"
      abbr="Add content"
      menuContent={menuContent}
      hoverElement={<AddIcon className="add-icon" tabIndex={0} />}
    />
  ) : null
}
