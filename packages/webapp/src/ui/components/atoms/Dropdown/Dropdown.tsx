import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { FC, useEffect, useRef, useState } from 'react';
import './styles.scss';

export type DropdownOptionsType = string[] | [string, React.ReactNode][]

export type DropdownProps = {
  label?: string
  placeholder?: string
  disabled?: boolean
  hidden?: boolean
  autoUpdate?: boolean
  className?: string
  getValue?(value: string): void
  inputAttrs?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  hasSearch?: boolean
  options: DropdownOptionsType
}

export const Dropdown: FC<DropdownProps> = ({ label, placeholder, hidden, getValue, hasSearch, options, disabled}) => {
  const [value, setValue] = useState<string | undefined | null>(undefined)
  const [isOnHover, setIsOnHover] = useState<boolean>(false)
  const dropdownButton = useRef<HTMLInputElement>(null)
  const dropdownContent = useRef<HTMLDivElement>(null)

  const type: 'Text' | 'IconAndText' = options && typeof options[0] === 'string' ? 'Text' : 'IconAndText'

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    filterFunction()
    setValue(e.currentTarget.value)
  }

  const handleOnClick = () => {
    dropdownContent.current && (dropdownContent.current.style.visibility = 'visible')
  }

  window.addEventListener('DOMContentLoaded', () => {
    setOptionListPosition()
  })
  window.onscroll = window.onresize = () => setOptionListPosition()


  const setOptionListPosition = () => { 
    const viewportOffset = dropdownButton.current && dropdownButton.current.getBoundingClientRect()
    const top = viewportOffset?.top
    const bottom = viewportOffset && (window.innerHeight - viewportOffset.bottom)

    if (bottom && top && (bottom > 160 || bottom > top)) {
      dropdownContent.current && (dropdownContent.current.style.maxHeight = bottom && bottom < 160 ? bottom - 20 + 'px' : '160px')
      dropdownContent.current && (dropdownContent.current.style.top = label? '75px' : '50px')
      dropdownContent.current && (dropdownContent.current.style.bottom = 'auto')
      dropdownContent.current && (dropdownContent.current.style.transform = ' translate(-50%, 0px)')
    } else {
      dropdownContent.current && (dropdownContent.current.style.maxHeight = top && top < 160 ? top - 20 + 'px' : '160px')
      dropdownContent.current && (dropdownContent.current.style.bottom = '50px')
      dropdownContent.current && (dropdownContent.current.style.top = 'auto')
      dropdownContent.current && (dropdownContent.current.style.transform = ' translate(-50%, 0px)')
    }
  }

  const handleOnSelection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setValue((e.target as HTMLElement).innerText)
    dropdownContent.current && (dropdownContent.current.style.visibility = 'hidden')
  }

  const handleOnBlur = () => {
    if (!isOnHover) {
      dropdownContent.current && (dropdownContent.current.style.visibility = 'hidden')
    }
  }

  useEffect(() => {
    getValue && value && getValue(value)
  }, [value, getValue])

  const filterFunction = () => {
    const filter = dropdownButton.current?.value.toUpperCase()
    const div = dropdownContent.current
    let length = 0
    Array.prototype.slice.call(div?.getElementsByClassName('option')).forEach((e) => {
      const txtValue = e.innerText.toUpperCase()
      if (txtValue.indexOf(filter) > -1) {
        txtValue === filter && setValue(e.innerText) 
        e.style.display = ''
        length ++
      } else {
        e.style.display = 'none'
      }
    })
    length > 0 ? div && (div.style.visibility = 'visible') : div && (div.style.visibility = 'hidden')
  }

  const optionsList = type === 'Text' ? (
    options?.map((value, i) => {
      return (
        <div key={i} className="option only-text" onClick={e => handleOnSelection(e)}>
          {value}
        </div>
      )
  })) : (
    options?.map((value, i) => {
      return (
        <div key={i} className="option icon-and-text" onClick={e => handleOnSelection(e)}>
          {value[1]}
          <span>{value[0]}</span>
        </div>
      )
    })
  )

  return (
    <div
      className={`dropdown ${hasSearch ? 'search' : ''} ${disabled ? 'disabled' : ''}`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label && <label>{label}</label>}
      <div className="dropdown-button button">
        <input
          ref={dropdownButton}
          className=" dropdown-button button search-field"
          type="text"
          placeholder={placeholder}
          onChange={handleOnChange}
          onClick={handleOnClick}
          onBlur={handleOnBlur}
          value={value ? value : ''}
        />
        <ExpandMoreIcon />
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
  hidden: false,
  className: '',
  getValue: () => undefined,
}

export default Dropdown