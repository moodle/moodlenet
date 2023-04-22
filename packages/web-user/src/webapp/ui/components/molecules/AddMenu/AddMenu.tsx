import { FloatingMenu } from '@moodlenet/component-library'
import { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'
import { FC, ReactNode } from 'react'
import { ReactComponent as AddIcon } from '../../../assets/icons/add-round.svg'

export type AddMenuItemRegItem = Omit<AddMenuItem, 'key'>
export type AddMenuItem = {
  Icon: ReactNode
  text: string
  key: string | number
  path?: Href
  className?: string
  position?: number
  onClick?: () => unknown
}
export type AddMenuProps = {
  menuItems?: AddMenuItem[]
}

export const AddMenu: FC<AddMenuProps> = ({ menuItems }) => {
  const addMenuItems: AddMenuItem[] = [
    // {
    //   Icon: <NoteAddIcon />,
    //   text: /* t */ `New resource`,
    //   path: newResourceHref,
    //   key: 'new-resoure',
    // },
    // {
    //   Icon: <LibraryAddIcon />,
    //   text: /* t */ `New collection`,
    //   path: newCollectionHref,
    //   key: 'new-collection',
    // },
  ]

  const updatedMenuItems = addMenuItems.concat(menuItems ?? [])

  return updatedMenuItems.length > 0 ? (
    <FloatingMenu
      className="add-menu"
      key="add-menu"
      abbr="Add content"
      menuContent={updatedMenuItems.map(menuItem => {
        // reoderedmenuItems.map((menuItem, i) => {
        return menuItem.path ? (
          <Link
            key={menuItem.key}
            className={`add-menu-item ${menuItem.className}`}
            href={menuItem.path}
          >
            <>
              {menuItem.Icon}
              {menuItem.text}
            </>
          </Link>
        ) : (
          <div
            key={menuItem.key}
            className={`add-menu-item ${menuItem.className}`}
            onClick={menuItem.onClick}
          >
            <>
              {menuItem.Icon}
              {menuItem.text}
            </>
          </div>
        )
      })}
      hoverElement={<AddIcon className="add-icon" tabIndex={0} />}
    />
  ) : null
}
