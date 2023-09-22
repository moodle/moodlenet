import { ArrowDropDown } from '@mui/icons-material'
import type { FC } from 'react'
import { Fragment } from 'react'
import type { FloatingMenuContentItem } from '../FloatingMenu/FloatingMenu.js'
import FloatingMenu from '../FloatingMenu/FloatingMenu.js'
import PrimaryButton from '../PrimaryButton/PrimaryButton.js'
import SecondaryButton from '../SecondaryButton/SecondaryButton.js'
import './SimpleDropdown.scss'

export type SimpleDropdownProps = {
  label: string
  list: { name: string; key: string }[]
  selected: string[]
  onClick: (e: string) => void
  className?: string
  initialSelection?: string
  notHighlightInitialSelection?: boolean
}

export const SimpleDropdown: FC<SimpleDropdownProps> = ({
  list,
  className,
  selected,
  onClick,
  label,
  notHighlightInitialSelection,
  initialSelection,
}) => {
  const currentName: string[] = []
  const menuContent = list.map(({ name, key }) => {
    const isCurrent = selected.indexOf(key) > -1
    isCurrent && currentName.push(name)
    const floatingMenuContentItem: FloatingMenuContentItem = {
      Element: (
        <Fragment key={key}>
          <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
            <div className={`border ${isCurrent ? 'selected' : ''}`} />
          </div>
          <div onClick={() => onClick(key)} className={`content ${isCurrent ? 'selected' : ''}`}>
            {name}
          </div>
        </Fragment>
      ),

      wrapperClassName: 'section',
    }
    return floatingMenuContentItem
  })

  const isInitialSelection = initialSelection && selected.indexOf(initialSelection) > -1
  const highlightInitialSelection =
    !notHighlightInitialSelection || !(notHighlightInitialSelection && isInitialSelection)

  return (
    <FloatingMenu
      className={`simple-dropdown ${className}`}
      hoverElement={
        currentName.length > 0 && highlightInitialSelection ? (
          <PrimaryButton>
            {currentName.length === 1 ? (
              <>{currentName[0]}</>
            ) : (
              <>
                label <div className="num-selected-elements">{currentName.length}</div>
              </>
            )}{' '}
            <ArrowDropDown />
          </PrimaryButton>
        ) : (
          <SecondaryButton>
            {label} <ArrowDropDown />
          </SecondaryButton>
        )
      }
      menuContent={menuContent}
    />
  )
}

SimpleDropdown.defaultProps = {}
SimpleDropdown.displayName = 'SimpleDropdown'
export default SimpleDropdown
