import React, { FC, useState } from "react";
import "./styles.scss";

export type DropdownProps = {
  label?: string
  placeholder: string
  disabled?: boolean
  hidden?: boolean
  autoUpdate?: boolean
  className?: string
  getValue?(text: string): void
  inputAttrs?:React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  hasSearch?: boolean
  options: string[] | [string, HTMLImageElement][]
}

export const Dropdown: FC<DropdownProps> = ({
  label,
  placeholder,
  hidden,
  getValue,
  hasSearch,
  options,
}) => { 
  const [text, setText] = useState<string |undefined | null>(undefined)

  const type: 'Text' | 'IconAndText' = typeof options[0] === 'string' ? 'Text' : 'IconAndText'

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    getValue && getValue(text ? text : '')
  }

  const dropdownButton = document.getElementById('dropdown-button')
  const dropdownContent = document.getElementById('dropdown-content')

  const handleOnChange = () => {}

  const setOptionListPosition = () => {
    const topPos = dropdownButton?.offsetTop;
    console.log(topPos)
  }

  setOptionListPosition()

  const handleSelection = (index:number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log('clicked')
    const element = e.target  as HTMLElement
    dropdownButton && dropdownButton.classList.remove("hover")
    dropdownContent && (dropdownContent.style.visibility = 'hidden')
    const text =  element.innerText
    setText(text)
    console.log(index + ' - ' + text)
  }



  const optionsList = type === 'Text' ? (
    options.map((value, index) => {
      return (
        <div key={index} className='option only-text' onClick={(e) => handleSelection(index, e)}>
          {value}
        </div>
      )
    })) : (
    options.map((value, index) => {
      return (
        <div key={index} className='option icon-and-text' onClick={(e) => handleSelection(index, e)}>
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
    >
      { label ? <label>{label}</label> : <></> }
      { type === 'Text' ? (
        <input id="dropdown-button" className="button search-field" type="text" placeholder={placeholder} onKeyUp={handleKeyUp} onChange={handleOnChange}/>
      ) : (
        <div className="button"></div>
      )}
      <div id="dropdown-content">
        {optionsList}
      </div>
    </div>
  )
};

Dropdown.defaultProps = {
  hidden: false,
  className: '',
  getValue: () => '',
}

export default Dropdown;