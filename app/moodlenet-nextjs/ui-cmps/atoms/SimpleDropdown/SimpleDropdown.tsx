'use client'
// import { ArrowDropDown } from '@mui/icons-material'
import { Fragment } from 'react'
import type { TextOptionProps } from '../Dropdown/Dropdown.jsx'
import type { FloatingMenuContentItem } from '../FloatingMenu/FloatingMenu.jsx'
import FloatingMenu from '../FloatingMenu/FloatingMenu.jsx'
import PrimaryButton from '../PrimaryButton/PrimaryButton.jsx'
import SecondaryButton from '../SecondaryButton/SecondaryButton.jsx'
import './SimpleDropdown.scss'

export type SimpleDropdownProps = {
  label: string
  options: TextOptionProps[]
  selected: string[]
  onClick: (e: string) => void
  className?: string
  initialSelection?: string
  notHighlightInitialSelection?: boolean
}

export default function SimpleDropdown({
  options,
  className,
  selected,
  onClick,
  label,
  notHighlightInitialSelection,
  initialSelection,
}: SimpleDropdownProps) {
  const currentName: string[] = []
  const menuContent = options.map(({ value, label }, i) => {
    const isCurrent = selected.indexOf(value) > -1
    isCurrent && currentName.push(label)
    const previousKey = options[i - 1] ? options[i - 1]?.value : null
    const prevSelected = previousKey && selected.indexOf(previousKey) > -1 && isCurrent
    const nextKey = options[i + 1] ? options[i + 1]?.value : null
    const nextSelected = nextKey && selected.indexOf(nextKey) > -1 && isCurrent

    const floatingMenuContentItem: FloatingMenuContentItem = {
      Element: (
        <Fragment key={value}>
          <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
            <div
              className={`border ${isCurrent ? 'selected' : ''} ${
                prevSelected ? 'prev-selected' : ''
              } ${nextSelected ? 'next-selected' : ''}`}
            />
          </div>
          <div
            onClick={() => onClick(value)}
            className={`content ${isCurrent ? 'selected' : ''}
            ${prevSelected ? 'prev-selected' : ''}
          `}
          >
            {label}
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
                {label} <div className="num-selected-elements">{currentName.length}</div>
              </>
            )}
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
