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
  useSelections,
  useSelectorOption,
} from '../../../lib/selector'
import './styles.scss'
import { setListPosition } from './utils'

export type DropdownProps = SelectorProps & {
  getOptionHeader(key: string): readonly [label: string, icon?: ReactNode]
  searchByText?: ((text: string) => unknown) | undefined
  className?: string
  label: string
  edit?: boolean
  highlight?: boolean
  headerOnly?: 'icon' | 'label'
}
export const Dropdown: FC<DropdownProps> = (props) => {
  const {
    children,
    getOptionHeader,
    edit,
    searchByText,
    className,
    label,
    highlight,
    headerOnly,
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
    headerOnly,
    children,
    multiple,
  } = props

  const [showContentFlag, toggleOpen] = useReducer((_) => !_, false)
  const [isHoveringOptions, setHoveringOptions] = useState(false)

  const showContent = edit ? showContentFlag : false

  const valueArr =
    props.value === undefined
      ? undefined
      : props.multiple
      ? props.value
      : [props.value]

  const inputValue = valueArr?.map((val) => getOptionHeader(val)[0]).join(' , ')

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
              defaultValue={inputValue}
            />
            <ExpandLessIcon onClickCapture={toggleOpen} />
          </>
        ) : (
          <>
            <DDHeader
              headerOnly={headerOnly}
              getOptionHeader={getOptionHeader}
            />
            <ExpandMoreIcon />
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

const DDHeader: FC<Pick<DropdownProps, 'getOptionHeader' | 'headerOnly'>> = ({
  getOptionHeader,
  headerOnly,
}) => {
  const selections = useSelections()
  return (
    <div className="dropdown-button">
      {selections.map((optValue) => {
        const [label, icon] = getOptionHeader(optValue)
        const icon_node =
          typeof icon === 'string' ? <img src={icon} alt={label}></img> : icon

        return (
          <>
            {(!headerOnly || headerOnly === 'icon') && icon_node}
            <div key={optValue} className="icons scroll">
              {(!headerOnly || headerOnly === 'label') && label}
            </div>
          </>
        )
      })}
    </div>
  )
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
