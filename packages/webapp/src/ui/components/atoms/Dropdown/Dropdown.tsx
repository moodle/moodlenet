import React, { FC, useEffect, useState } from "react";
import "./styles.scss";

export type DropdownOptionsType = string[] | [string, React.ReactNode][]

export type DropdownProps = {
  label?: string
  placeholder?: string
  disabled?: boolean
  hidden?: boolean
  autoUpdate?: boolean
  className?: string
  getIndex?(index: number | undefined): void
  inputAttrs?:React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  hasSearch?: boolean
  options: DropdownOptionsType
}

export const Dropdown: FC<DropdownProps> = ({
  label,
  placeholder,
  hidden,
  getIndex,
  hasSearch,
  options
}) => { 
  const [value, setValue] = useState<string |undefined | null>(undefined)
  const [index, setIndex] = useState<number |undefined | null>(undefined)

  const type: 'Text' | 'IconAndText' = typeof options[0] === 'string' ? 'Text' : 'IconAndText'

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('Searching for: ' + e.currentTarget.value)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    filterFunction()
    setValue(e.currentTarget.value)
  }

  const handleOnClick = () => {
    const dropdownButton = document.getElementById('dropdown-button')
    const dropdownContent = document.getElementById('dropdown-content')
    dropdownButton && dropdownButton.classList.remove("focus")
    dropdownContent && dropdownContent.classList.add("focus")
    dropdownContent && (dropdownContent.style.visibility = 'visible')
  }

  const setOptionListPosition = () => {
    const dropdownButton = document.getElementById('dropdown-button')
    const topPos = dropdownButton?.offsetTop;
    console.log(topPos)
  }

  setOptionListPosition()

  const handleOnSelection = (i:number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIndex(i)
    setValue((e.target as HTMLElement).innerText)
    const dropdownContent = document.getElementById('dropdown-content')
    console.log('clicked')
    dropdownContent && (dropdownContent.style.visibility = 'hidden')
  }

  const handleOnMouseOut = () => {
    setTimeout(() => {
      const dropdownContent = document.getElementById('dropdown-content')
      dropdownContent && (dropdownContent.style.visibility = 'hidden')
    }, 100);
    
  }

  useEffect(() => {
    getIndex && getIndex(index ? index : undefined)
  }, [index, getIndex]);

  const filterFunction = () => {
    const filter = (document.getElementById("dropdown-button") as HTMLInputElement).value.toUpperCase()
    console.log('filter: ' + filter)
    const div = document.getElementById("dropdown-content") as HTMLDivElement
    Array.prototype.slice.call(div.getElementsByClassName("option")).map(e => {
      const txtValue = e.innerText.toUpperCase()
      console.log(e)
      console.log(txtValue)
      if (txtValue.indexOf(filter) > -1) {
        console.log('Found!')
        e.style.display = '';
      } else {
        console.log('Not found!')
        e.style.display = 'none';
      }
    })
  }



  const optionsList = type === 'Text' ? (
    options.map((value, i) => {
      return (
        <div key={i} className='option only-text' onClick={(e) => handleOnSelection(i, e)}>
          {value}
        </div>
      )
    })) : (
    options.map((value, i) => {
      return (
        <div key={i} className='option icon-and-text' onClick={(e) => handleOnSelection(i, e)}>
          {value[1]}
          <div className="text">{value[0]}</div>
        </div>
      )  
    }))


  return (
    <div 
      className={`dropdown ${hasSearch ? 'search' : ''}`}
      style={{visibility: hidden ? 'hidden' : 'visible'}}
      hidden={hidden}
      onBlur={handleOnMouseOut}
    >
      { label ? <label>{label}</label> : <></> }
      <input 
        id="dropdown-button" 
        className="button search-field" 
        type="text"
        placeholder={placeholder} 
        onKeyUp={handleOnKeyUp} 
        onChange={handleOnChange}
        onClick={handleOnClick}
        value={value? value : ''}
      />
      <div id="dropdown-content">
        {optionsList}
      </div>
    </div>
  )
};

Dropdown.defaultProps = {
  placeholder: '',
  hidden: false,
  className: '',
  getIndex: () => undefined,
}

export default Dropdown;