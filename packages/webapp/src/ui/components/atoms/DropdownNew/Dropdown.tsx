// import { SvgIconTypeMap } from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import {
  Selector,
  SelectorProps,
  useSelectorOption,
} from '../../../lib/selector'
import RoundButton from '../RoundButton/RoundButton'
import './styles.scss'
import { setListPosition } from './utils'

export type DropdownProps = SelectorProps & {
  pills: ReactNode[] | undefined
  searchByText?: ((text: string) => unknown) | undefined
  searchText?: string
  label: string
  edit?: boolean
  highlight?: boolean
  multilines?: boolean
}
export const Dropdown: FC<DropdownProps> = (props) => {
  const {
    children,
    pills,
    edit,
    searchByText,
    label,
    highlight,
    multilines,
    searchText,
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
    pills,
    highlight,
    multilines,
    edit,
    label,
    searchByText,
    disabled,
    className,
    hidden,
    children,
    multiple,
    searchText,
  } = props

  const [showContentFlag, toggleOpen] = useReducer((_) => !_, false)
  const [isHoveringOptions, setHoveringOptions] = useState(false)

  const showContent = edit && showContentFlag

  useEffect(() => {
    const clickOutListener = ({ target }: MouseEvent) => {
      if (
        mainElemRef.current === target ||
        mainElemRef.current?.contains(target as any)
      ) {
        return
      }
      showContentFlag && toggleOpen()
    }
    window.addEventListener('click', clickOutListener)
    return () => window.removeEventListener('click', clickOutListener)
  }, [showContentFlag])

  const setLayout = useCallback(() => {
    showContent &&
      setListPosition({
        displayMode: false,
        dropdownButton,
        dropdownContent,
        label,
        window,
      })
  }, [label, showContent])

  useLayoutEffect(() => {
    showContent && setLayout()
    window.addEventListener('scroll', setLayout)
    window.addEventListener('resize', setLayout)
    return () => {
      window.removeEventListener('scroll', setLayout)
      window.removeEventListener('resize', setLayout)
    }
  }, [setLayout, showContent])

  useLayoutEffect(() => dropdownButton.current?.focus())
  useEffect(() => {
    showContent && searchByText?.('')
  }, [showContent, searchByText])

  const mainElemRef = useRef<HTMLDivElement>(null)
  const dropdownButton = useRef<HTMLInputElement>(null)
  const dropdownContent = useRef<HTMLInputElement>(null)

  return (
    <div
      ref={mainElemRef}
      className={`dropdown-new ${searchByText ? 'search' : ''} ${
        disabled ? 'disabled' : ''
      } ${!edit ? 'not-editing' : ''} ${className ?? ''}`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      <label>{label}</label>
      <div
        onClick={showContent ? undefined : toggleOpen}
        className={`input-container${!edit ? ' not-editing' : ''}${
          highlight ? ' highlight' : ''
        }`}
      >
        {showContent ? (
          <>
            <input
              ref={dropdownButton}
              className={`dropdown-button search-field  ${
                !edit ? 'not-editing' : ''
              }`}
              placeholder={label}
              onInput={({ currentTarget }) =>
                searchByText?.(currentTarget.value)
              }
              onBlur={showContent && isHoveringOptions ? undefined : toggleOpen}
              disabled={disabled || !edit}
              defaultValue={searchText}
            />
            <ExpandLessIcon onClickCapture={toggleOpen} />
          </>
        ) : (
          <>
            <div
              className={`dropdown-button ${multiple ? 'multiple' : 'single'} 
              ${multilines ? 'multilines' : ''} 
              ${multiple && !multilines ? 'scroll' : ''}
              `}
            >
              {pills}
            </div>
            {edit && <ExpandMoreIcon />}
          </>
        )}
      </div>

      {showContent && (
        <div
          ref={dropdownContent}
          onMouseEnter={() => setHoveringOptions(true)}
          onMouseLeave={() => setHoveringOptions(false)}
          className="dropdown-content"
          tabIndex={-1}
          onClick={multiple ? undefined : toggleOpen}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export const SimplePill: FC<{
  value: string
  label: string
  edit?: boolean
}> = ({ label, value, edit }) => {
  const { toggle } = useSelectorOption(value)
  return (
    <div className="dropdown-pill">
      <div className="label">{label}</div>
      {edit && <RoundButton onClick={toggle} />}
    </div>
  )
}
export const IconPill: FC<{
  icon: ReactNode
}> = ({ icon }) => {
  return <div className="dropdown-pill icon">{icon}</div>
}

export const TextOption: FC<{ value: string; label: ReactNode }> = ({
  value,
  label,
}) => {
  const { toggle, selected } = useSelectorOption(value)
  return (
    <div
      key={value}
      className={`${selected ? 'selected ' : ''}option only-text`}
      onClick={toggle}
    >
      {label}
    </div>
  )
}

export const IconTextOption: FC<{
  value: string
  label: ReactNode
  icon: ReactNode
}> = ({ value, label, icon }) => {
  const { toggle, selected } = useSelectorOption(value)
  return (
    <div
      key={value}
      className={`${selected ? 'selected ' : ''}option icon-and-text`}
      onClick={toggle}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}
