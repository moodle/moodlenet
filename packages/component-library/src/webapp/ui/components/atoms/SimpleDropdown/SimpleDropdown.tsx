import { ArrowDropDown } from '@material-ui/icons'
import { FC } from 'react'
import FloatingMenu from '../FloatingMenu/FloatingMenu.js'
import PrimaryButton from '../PrimaryButton/PrimaryButton.js'
import SecondaryButton from '../SecondaryButton/SecondaryButton.js'
import './SimpleDropdown.scss'

export type SimpleDropdownProps = {
  label: string
  list: string[]
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
  const menuContent = list.map(e => {
    const isCurrent = selected.indexOf(e) > -1
    isCurrent && currentName.push(e)
    return (
      <div key={e} className="section" onClick={() => onClick(e)}>
        <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
          <div className={`border ${isCurrent ? 'selected' : ''}`} />
        </div>
        <div className={`content ${isCurrent ? 'selected' : ''}`}>
          <span>{e}</span>
        </div>
      </div>
    )
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
