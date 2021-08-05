import React, { FC, useEffect, useRef, useState } from 'react'
import './styles.scss'

export type DropdownOptionsType = string[] | [string, React.ReactNode][]

export type DropdownProps = {
  label?: string
  placeholder?: string
  disabled?: boolean
  hidden?: boolean
  autoUpdate?: boolean
  className?: string
  getIndex?(index: number | undefined): void
  inputAttrs?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  hasSearch?: boolean
  options: DropdownOptionsType
}

export const Dropdown: FC<DropdownProps> = ({ label, placeholder, hidden, getIndex, hasSearch, options, disabled}) => {
  const [value, setValue] = useState<string | undefined | null>(undefined)
  const [index, setIndex] = useState<number | undefined | null>(undefined)
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

    if (bottom && top && (bottom > 200 || bottom > top)) {
      dropdownContent.current && (dropdownContent.current.style.maxHeight = bottom && bottom < 200 ? bottom - 20 + 'px' : '200px')
      dropdownContent.current && (dropdownContent.current.style.top = '74px')
      dropdownContent.current && (dropdownContent.current.style.bottom = 'auto')
    } else {
      dropdownContent.current && (dropdownContent.current.style.maxHeight = top && top < 200 ? top - 20 + 'px' : '200px')
      dropdownContent.current && (dropdownContent.current.style.bottom = '50px')
      dropdownContent.current && (dropdownContent.current.style.top = 'auto')
    }
  }

  const handleOnSelection = (i: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIndex(i)
    setValue((e.target as HTMLElement).innerText)
    dropdownContent.current && (dropdownContent.current.style.visibility = 'hidden')
  }

  const handleOnBlur = () => {
    if (!isOnHover) {
      dropdownContent.current && (dropdownContent.current.style.visibility = 'hidden')
    }
  }

  useEffect(() => {
    getIndex && getIndex(index ? index : undefined)
  }, [index, getIndex])

  const filterFunction = () => {
    const filter = dropdownButton.current?.value.toUpperCase()
    const div = dropdownContent.current
    let length = 0
    Array.prototype.slice.call(div?.getElementsByClassName('option')).forEach((e) => {
      const txtValue = e.innerText.toUpperCase()
      if (txtValue.indexOf(filter) > -1) {
        txtValue === filter && setIndex(e.getAttribute('data-key')) 
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
        <div key={i} data-key={i} className="option only-text" onClick={e => handleOnSelection(i, e)}>
          {value}
        </div>
      )
  })) : (
    options?.map((value, i) => {
      return (
        <div key={i} data-key={i} className="option icon-and-text" onClick={e => handleOnSelection(i, e)}>
          {value[1]}
          {value[0]}
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
      {label ? <label>{label}</label> : <></>}
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
  placeholder: '',
  hidden: false,
  className: '',
  getIndex: () => undefined,
}

export default Dropdown