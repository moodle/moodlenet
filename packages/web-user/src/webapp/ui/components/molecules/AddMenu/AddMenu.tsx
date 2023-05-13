import type { FloatingMenuContentItem } from '@moodlenet/component-library'
import { FloatingMenu } from '@moodlenet/component-library'
import type { ComponentType, FC } from 'react'
import { useMemo } from 'react'
import { ReactComponent as AddIcon } from '../../../assets/icons/add-round.svg'
import type {
  CreateCollectionAddMenuItemProps,
  CreateResourceAddMenuItemProps,
} from './AddMenuItems.js'
import { CreateCollectionAddMenuItem, CreateResourceAddMenuItem } from './AddMenuItems.js'

export type AddMenuItem = {
  Component: ComponentType
  key: string
  className?: string
}
export type AddMenuProps = {
  createCollectionProps: CreateCollectionAddMenuItemProps
  createResourceProps: CreateResourceAddMenuItemProps
  menuItems: AddMenuItem[]
}

export const AddMenu: FC<AddMenuProps> = ({
  menuItems,
  createCollectionProps,
  createResourceProps,
}) => {
  const menuContent = useMemo(() => {
    const createCollectionItem: AddMenuItem = {
      Component: () => <CreateCollectionAddMenuItem {...createCollectionProps} />,
      key: 'new collection',
    }
    const createResourceItem: AddMenuItem = {
      Component: () => <CreateResourceAddMenuItem {...createResourceProps} />,
      key: 'new resource',
    }
    return [createResourceItem, createCollectionItem, ...menuItems].map(
      ({ Component, key, className = '' }) => {
        const floatingMenuContentItem: FloatingMenuContentItem = {
          Component,
          key,
          className: `add-menu-item ${className}`,
        }
        // reoderedmenuItems.map((menuItem, i) => {
        return floatingMenuContentItem
      },
    )
  }, [createCollectionProps, createResourceProps, menuItems])

  return (
    <FloatingMenu
      className="add-menu"
      key="add-menu"
      abbr="Add content"
      menuContent={menuContent}
      hoverElement={<AddIcon className="add-icon" tabIndex={0} />}
    />
  )
}
