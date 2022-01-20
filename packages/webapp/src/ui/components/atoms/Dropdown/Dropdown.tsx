import { SvgIconTypeMap } from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import './styles.scss'
import { setListPosition } from './utils'

export type DropdownOptionsType = (
  | [string, React.ReactNode | SvgIconTypeMap]
  | string
)[]

export type DropdownProps = {
  label?: string
  placeholder?: string
  disabled?: boolean
  hidden?: boolean
  autoUpdate?: boolean
  value?: string | null
  highlight?: boolean
  edit?: boolean
  displayMode?: boolean
  className?: string
  getValue?(currentValue: string): void
  hasSearch?: boolean
  options: DropdownOptionsType
}

export const Dropdown: FC<DropdownProps> = ({
  label,
  placeholder,
  hidden,
  getValue,
  hasSearch,
  value,
  edit,
  displayMode,
  highlight,
  options,
  disabled,
  className,
}) => {
  const type =
    options && typeof options[0] === 'string' ? 'Text' : 'IconAndText'

  const [currentValue, setValue] = useState<string | undefined | null>(
    value ? value : undefined
  )
  const [index, setIndex] = useState<number | undefined | null>(undefined)
  const [isOnHover, setIsOnHover] = useState<boolean>(false)
  const [isIconVisible, setIsIconVisible] = useState<boolean>(false)
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false)
  const dropdownButton = useRef<HTMLInputElement>(null)
  const dropdownContent = useRef<HTMLDivElement>(null)

  // const _set = useRef(false)
  useEffect(() => {
    // if(value /* && !_set.current */){
    setValue(value)
    // _set.current=true
    // }
  }, [value])

  const handleOnChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    filterFunction()
    setValue(e.currentTarget.value)
  }

  const handleOnClick = () => {
    if (edit) {
      setIsIconVisible(false)
      setIsContentVisible(true)
      dropdownContent.current &&
        (dropdownContent.current.style.visibility = 'visible')
      setTimeout(
        () => dropdownButton.current && dropdownButton.current.focus(),
        100
      )
    }
  }

  const setListOptionsPosition = useCallback(() => {
    setListPosition(dropdownContent, dropdownButton, label, displayMode, window)
  }, [dropdownContent, dropdownButton, label, displayMode])

  useEffect(() => {
    window.addEventListener('scroll', setListOptionsPosition, true)
    window.addEventListener('resize', setListOptionsPosition, true)
    return () => {
      window.removeEventListener('scroll', setListOptionsPosition, true)
      window.removeEventListener('resize', setListOptionsPosition, true)
    }
  }, [setListOptionsPosition])

  useEffect(() => {
    setListPosition(dropdownContent, dropdownButton, label, displayMode, window)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO
  const handleOnKeyDown = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === 'ArrowUp') {
      // Up
    } else if (e.key === 'ArrowDown') {
      // Down
      //dropdownButton.current?.isSameNode(e.currentTarget) &&
      //dropdownContent.current && (dropdownContent.current.firstChild as HTMLElement)?.focus()
    }
  }

  const handleOnSelection = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    i: number
  ) => {
    setValue((e.currentTarget as HTMLElement).innerText)
    setIndex(i)
    dropdownContent.current &&
      (dropdownContent.current.style.visibility = 'hidden')
    setIsIconVisible(true)
    setIsContentVisible(false)
  }

  const handleOnBlur = () => {
    if (!isOnHover) {
      dropdownContent.current &&
        (dropdownContent.current.style.visibility = 'hidden')
      index && setIsIconVisible(true)
      setIsContentVisible(false)
    }
  }

  useEffect(() => {
    type === 'IconAndText' &&
      value === 'string' &&
      value.length > 0 &&
      setIsIconVisible(true)
  }, [type, value, setIsIconVisible])

  useEffect(() => {
    getValue && currentValue && getValue(currentValue)
  }, [currentValue, getValue])

  useEffect(() => {
    typeof index === 'number' && setIsIconVisible(true)
  }, [index])

  const filterFunction = useCallback((value?: string) => {
    const filter = (
      value ? value : dropdownButton.current?.value
    )?.toUpperCase()
    const div = dropdownContent.current
    let length = 0
    //FIXME: can't call this way as div may be null
    // Array.prototype.slice.call(null) throws
    // TSC can't detect issues on these hacks ( `this` substitution )
    Array.prototype.slice
      .call(div?.getElementsByClassName('option'))
      .forEach((e, i) => {
        const txtValue = e.innerText.toUpperCase()
        if (txtValue.indexOf(filter) > -1) {
          setValue(e.innerText)
          txtValue === filter ? setIndex(i) : setIndex(undefined)
          e.style.display = ''
          length++
        } else {
          setIndex(undefined)
          e.style.display = 'none'
        }
      })
    length > 0
      ? div && (div.style.visibility = 'visible')
      : div && (div.style.visibility = 'hidden')
  }, [])

  useEffect(() => {
    if (type === 'IconAndText' && value && options) {
      const newOptions = options as any[]
      newOptions.every((e, i) => {
        return value === e[0] && setIndex(i)
      })
    }
  }, [value, type, options])

  const optionsList =
    type === 'Text'
      ? options?.map((currentValue, i) => {
          return (
            <div
              key={i}
              data-key={i}
              className="option only-text"
              onClick={(e) => handleOnSelection(e, i)}
              onKeyUp={handleOnKeyDown}
            >
              {currentValue}
            </div>
          )
        })
      : options?.map((currentValue, i) => {
          return (
            <div
              key={i}
              data-key={i}
              className="option icon-and-text"
              onClick={(e) => handleOnSelection(e, i)}
              onKeyUp={handleOnKeyDown}
            >
              {currentValue[1]}
              <span>{currentValue[0]}</span>
            </div>
          )
        })

  return (
    <div
      className={`dropdown ${hasSearch ? 'search' : ''} ${
        disabled ? 'disabled' : ''
      } ${displayMode ? 'display-mode' : ''} ${!edit ? 'not-editing' : ''} ${
        className ? className : ''
      }`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label && <label>{label}</label>}
      <div
        className={`input-container${displayMode ? ' display-mode' : ''}${
          !edit ? ' not-editing' : ''
        }${highlight ? ' highlight' : ''}`}
        onClick={handleOnClick}
      >
        <input
          ref={dropdownButton}
          className={`dropdown-button search-field ${
            displayMode ? 'display-mode' : ''
          } ${!edit ? 'not-editing' : ''}`}
          type="input"
          style={
            type === 'Text' || !isIconVisible
              ? { visibility: 'visible', display: 'block' }
              : { visibility: 'hidden', display: 'none' }
          }
          placeholder={placeholder}
          onChange={handleOnChange}
          onClick={handleOnClick}
          onKeyDown={handleOnKeyDown}
          onBlur={handleOnBlur}
          disabled={disabled || !edit}
          value={currentValue ? currentValue : ''}
        />
        {isIconVisible &&
          typeof index === 'number' &&
          index > -1 &&
          options &&
          options[index]?.length === 2 &&
          options.map(
            (currentValue, i) =>
              i === index && (
                <div key={i} className="icons scroll">
                  {currentValue[1]}
                </div>
              )
          )}
        {isContentVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>
      <div
        ref={dropdownContent}
        className="dropdown-content"
        onMouseEnter={() => setIsOnHover(true)}
        onMouseLeave={() => setIsOnHover(false)}
        tabIndex={-1}
      >
        {optionsList}
      </div>
    </div>
  )
}

Dropdown.defaultProps = {
  edit: true,
}

export default Dropdown
