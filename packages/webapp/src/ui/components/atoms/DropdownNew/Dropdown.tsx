// import { SvgIconTypeMap } from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { FC, ReactNode, useReducer } from 'react'
import {
  Selector,
  SelectorProps,
  useSelections,
  useSelectorOption,
} from '../../../lib/selector'
import './styles.scss'

export type DropdownProps = SelectorProps & {
  getOptionHeader(key: string): string
  searchByText?: ((text: string) => unknown) | undefined
  className?: string
  label: string
  edit?: boolean
  highlight?: boolean
}
export const Dropdown: FC<DropdownProps> = (props) => {
  const {
    getOptionHeader,
    edit,
    searchByText,
    className,
    children,
    label,
    highlight,
    ...selectorProps
  } = props
  return (
    <Selector {...selectorProps}>
      <DropdownComp {...props}>{children}</DropdownComp>
    </Selector>
  )
}

const DropdownComp: FC<DropdownProps> = (props) => {
  const {
    getOptionHeader,
    highlight,
    edit,
    label,
    searchByText,
    disabled,
    className,
    hidden,
    children,
  } = props
  const selections = useSelections()
  const [isOpen, toggleOpen] = useReducer((_) => !_, false)

  const valueArr =
    props.value === undefined
      ? undefined
      : props.multiple
      ? props.value
      : [props.value]

  const inputValue = valueArr?.map(getOptionHeader).join(' , ')

  return (
    <div
      className={`dropdown ${searchByText ? 'search' : ''} ${
        disabled ? 'disabled' : ''
      } ${!edit ? 'not-editing' : ''} ${className ?? ''}`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      <label>{label}</label>
      <div
        className={`input-container${!edit ? ' not-editing' : ''}${
          highlight ? ' highlight' : ''
        }`}
        onClick={isOpen ? undefined : toggleOpen}
      >
        {isOpen ? (
          <>
            <input
              className={`dropdown-button search-field  ${
                !edit ? 'not-editing' : ''
              }`}
              placeholder={label}
              onInput={({ currentTarget }) =>
                searchByText?.(currentTarget.value)
              }
              disabled={disabled || !edit}
              defaultValue={inputValue}
            />
            <ExpandLessIcon />
          </>
        ) : (
          <>
            {selections.map((value) => (
              <div key={value} className="icons scroll">
                {getOptionHeader(value)}
              </div>
            ))}
            <ExpandMoreIcon />
          </>
        )}
      </div>

      {isOpen && (
        <div className="dropdown-content" tabIndex={-1} onClick={toggleOpen}>
          {children}
        </div>
      )}
    </div>
  )
}

export const TextOption: FC<{ value: string; label: ReactNode }> = ({
  value,
  label,
}) => {
  const { toggle /* , selected  */ } = useSelectorOption(value)
  return (
    <div key={value} className="option only-text" onClick={toggle}>
      {label}
    </div>
  )
}

export const IconTextOption: FC<{
  value: string
  label: ReactNode
  icon: ReactNode
}> = ({ value, label, icon }) => {
  const { toggle /* , selected  */ } = useSelectorOption(value)
  return (
    <div key={value} className="option icon-and-text" onClick={toggle}>
      {icon}
      <span>{label}</span>
    </div>
  )
}
