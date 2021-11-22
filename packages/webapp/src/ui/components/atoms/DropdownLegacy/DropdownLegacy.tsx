import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import './styles.scss'

export type DropdownOptionsType = ([string, React.ReactNode] | string)[]

export type DropdownLegacyProps = {
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

export const DropdownLegacy: FC<DropdownLegacyProps> = ({
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
}) => {
  const type = options && typeof options[0] === 'string' ? 'Text' : 'IconAndText'

  const [currentValue, setValue] = useState<string | undefined | null>(value ? value : undefined)
  const [index, setIndex] = useState<number | undefined | null>(undefined)
  const [isOnHover, setIsOnHover] = useState<boolean>(false)
  const [isIconVisible, setIsIconVisible] = useState<boolean>(false)
  const DropdownLegacyButton = useRef<HTMLInputElement>(null)
  const DropdownLegacyContent = useRef<HTMLDivElement>(null)
  
  // const _set = useRef(false)
  useEffect(() => {
    // if(value /* && !_set.current */){
      setValue(value)
      // _set.current=true
    // }
  }, [value])
  
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    filterFunction()
    setValue(e.currentTarget.value)
  }

  const handleOnClick = () => {
    if (edit) {
      setIsIconVisible(false)
      DropdownLegacyContent.current && (DropdownLegacyContent.current.style.visibility = 'visible')
      setTimeout(() => DropdownLegacyButton.current && DropdownLegacyButton.current.focus(), 100)
    }
  }

  window.onscroll = window.onresize = () => setOptionListPosition()

  const setOptionListPosition = () => {
    const viewportOffset = DropdownLegacyButton.current && DropdownLegacyButton.current.getBoundingClientRect()
    const top = viewportOffset?.top
    const bottom = viewportOffset && window.innerHeight - viewportOffset.bottom

    if (bottom && top && (bottom > 160 || bottom > top)) {
      DropdownLegacyContent.current &&
        (DropdownLegacyContent.current.style.maxHeight = bottom && bottom - 20 < 160 ? bottom - 20 + 'px' : '160px')
      DropdownLegacyContent.current && (DropdownLegacyContent.current.style.top = label && !displayMode ? '75px' : '50px')
      DropdownLegacyContent.current && (DropdownLegacyContent.current.style.bottom = 'auto')
      DropdownLegacyContent.current && (DropdownLegacyContent.current.style.transform = ' translate(-50%, 0px)')
    } else {
      DropdownLegacyContent.current &&
        (DropdownLegacyContent.current.style.maxHeight = top && top < 160 ? top - 20 + 'px' : '160px')
      DropdownLegacyContent.current && (DropdownLegacyContent.current.style.bottom = '50px')
      DropdownLegacyContent.current && (DropdownLegacyContent.current.style.top = 'auto')
      DropdownLegacyContent.current && (DropdownLegacyContent.current.style.transform = ' translate(-50%, 0px)')
    }
  }

  useEffect(() => {
    setOptionListPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      // Up
    } else if (e.key === 'ArrowDown') {
      // Down
      //DropdownLegacyButton.current?.isSameNode(e.currentTarget) &&
      //DropdownLegacyContent.current && (DropdownLegacyContent.current.firstChild as HTMLElement)?.focus()
    }
  }

  const handleOnSelection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i: number) => {
    setValue((e.currentTarget as HTMLElement).innerText)
    setIndex(i)
    DropdownLegacyContent.current && (DropdownLegacyContent.current.style.visibility = 'hidden')
    setIsIconVisible(true)
  }

  const handleOnBlur = () => {
    if (!isOnHover) {
      DropdownLegacyContent.current && (DropdownLegacyContent.current.style.visibility = 'hidden')
      index && setIsIconVisible(true)
    }
  }

  useEffect(() => {
    type === 'IconAndText' && value === 'string' && value.length > 0 && setIsIconVisible(true)
  }, [type, value, setIsIconVisible])

  useEffect(() => {
    getValue && currentValue && getValue(currentValue)
  }, [currentValue, getValue])

  useEffect(() => {
    typeof index === 'number' && setIsIconVisible(true)
  }, [index])

  const filterFunction = useCallback((value?: string) => {
    const filter = (value ? value : DropdownLegacyButton.current?.value)?.toUpperCase()
    const div = DropdownLegacyContent.current
    let length = 0
    //FIXME: can't call this way as div may be null
    // Array.prototype.slice.call(null) throws
    // TSC can't detect issues on these hacks ( `this` substitution )
    Array.prototype.slice.call(div?.getElementsByClassName('option')).forEach((e, i) => {
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
    length > 0 ? div && (div.style.visibility = 'visible') : div && (div.style.visibility = 'hidden')
  }, [])

  useEffect(() => {
    if (type === 'IconAndText' && value && options) {
      (options as any[]).every((e, i) => {
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
              onClick={e => handleOnSelection(e, i)}
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
              onClick={e => handleOnSelection(e, i)}
              onKeyUp={handleOnKeyDown}
            >
              {currentValue[1]}
              <span>{currentValue[0]}</span>
            </div>
          )
        })

  return (
    <div
      className={`dropdown-legacy ${hasSearch ? 'search' : ''} ${disabled ? 'disabled' : ''} ${
        displayMode ? 'display-mode' : ''
      } ${!edit ? 'not-editing' : ''}`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label && <label>{label}</label>}
      <div
        className={`input-container${displayMode ? ' display-mode' : ''}${!edit ? ' not-editing' : ''}${highlight ? ' highlight' : ''}`}
        onClick={handleOnClick}
      >
        <input
          ref={DropdownLegacyButton}
          className={`DropdownLegacy-button search-field ${displayMode ? 'display-mode' : ''} ${!edit ? 'not-editing' : ''}`}
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
              ),
          )}
        <ExpandMoreIcon />
      </div>
      <div
        ref={DropdownLegacyContent}
        className="DropdownLegacy-content"
        onMouseEnter={() => setIsOnHover(true)}
        onMouseLeave={() => setIsOnHover(false)}
        tabIndex={-1}
      >
        {optionsList}
      </div>
    </div>
  )
}

DropdownLegacy.defaultProps = {
  edit: true,
}

export default DropdownLegacy
