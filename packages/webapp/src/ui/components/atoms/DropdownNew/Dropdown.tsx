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
  pills: ReactNode
  searchByText?: ((text: string) => unknown) | undefined
  searchText?: string
  label?: string
  edit?: boolean
  error?: ReactNode
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
    error,
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
    error,
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
    placeholder,
  } = props

  const [showContentFlag, toggleOpen] = useReducer((_) => !_, false)
  const [isHoveringOptions, setHoveringOptions] = useState(false)
  const [errorLeaves, setErrorLeave] = useState<boolean>(false)
  const [currentError, setcurrentError] = useState<ReactNode>(undefined)

  const showContent = edit && showContentFlag

  useEffect(() => {
    const clickOutListener = ({ target }: MouseEvent) => {
      if (
        mainElemRef.current === target ||
        mainElemRef.current?.contains(target as any)
      ) {
        return
      }
      showContent && toggleOpen()
    }
    window.addEventListener('click', clickOutListener)
    return () => window.removeEventListener('click', clickOutListener)
  }, [showContent])

  const setLayout = useCallback(() => {
    showContent &&
      setListPosition({
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

  showContent && searchByText?.('')
  useLayoutEffect(() => {
    showContent && dropdownButton.current?.focus()
  }, [showContent])
  useEffect(() => {
    showContent && searchByText?.('')
  }, [showContent, searchByText])

  useEffect(() => {
    if (error) {
      setErrorLeave(false)
      setcurrentError(error)
    } else {
      if (currentError) {
        setErrorLeave(true)
        setTimeout(() => {
          setcurrentError(undefined)
        }, 500)
      } else {
        setcurrentError(undefined)
      }
    }
  }, [error, setErrorLeave, currentError])

  const mainElemRef = useRef<HTMLDivElement>(null)
  const dropdownButton = useRef<HTMLInputElement>(null)
  const dropdownContent = useRef<HTMLInputElement>(null)

  return (
    <div
      ref={mainElemRef}
      className={`dropdown-new ${className ? className : ''} ${
        searchByText ? 'search' : ''
      }${disabled ? ' disabled' : ''} ${
        highlight || error ? ' highlight' : ''
      } ${!errorLeaves && error ? 'enter-error' : ''} ${
        errorLeaves ? 'leave-error' : ''
      }`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label && <label>{label}</label>}
      <div
        onClick={showContent ? undefined : toggleOpen}
        className={`input-container${disabled || !edit ? ' not-editing' : ''}${
          highlight ? ' highlight' : ''
        }`}
      >
        {showContent || !pills ? (
          <>
            <input
              ref={dropdownButton}
              className={`dropdown-button search-field  ${
                disabled || !edit ? 'not-editing' : ''
              }`}
              placeholder={placeholder}
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
            {!disabled && edit && <ExpandMoreIcon />}
          </>
        )}
      </div>
      {currentError && !disabled && (
        <div className={`error-msg`}>{currentError}</div>
      )}

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
  label: ReactNode
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

export type TextOptionProps = {
  value: string
  label: string
}
export const TextOption: FC<TextOptionProps> = ({ value, label }) => {
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

export type IconTextOptionProps = {
  value: string
  label: string
  icon: ReactNode
}
export const IconTextOption: FC<IconTextOptionProps> = ({
  value,
  label,
  icon,
}) => {
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
