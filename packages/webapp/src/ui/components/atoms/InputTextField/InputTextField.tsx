import React, { FC, useState } from "react";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import "./styles.scss";

export type InputTextFieldProps = {
  label?: string
  placeholder: string
  textarea?: boolean
  disabled?: boolean
  hidden?: boolean
  autoUpdate?: boolean
  buttonName?: string
  className?: string
  value?: string | undefined
  getText?(text: string): void
}

export const InputTextField: FC<InputTextFieldProps> = ({
  label,
  placeholder,
  textarea,
  disabled,
  buttonName,
  hidden,
  autoUpdate,
  className,
  value,
  getText
}) => { 
  const [text, setText] = useState<string |undefined>(value)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      getText && getText(text ? text : '')
    }
  }

  const handleClick = () => {
    getText && getText(text ? text : '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value)
    if (autoUpdate) getText && getText(e.currentTarget.value)
  }


  return (
    <div 
      className={`input-text-field ${className} ${disabled ? 'disabled' : ''}`}
      style={{visibility: hidden ? 'hidden' : 'visible'}}
      hidden={hidden}
    >
      { label ? <label>{label}</label> : <></> }
      { textarea ? (
        <div className="textarea-container">
          <textarea 
            value={text}
            onChange={ handleChange }
            onKeyDown={ handleKeyDown }
            disabled={disabled}
            name="textarea" 
            cols={40} 
            rows={5}
          />
        </div>
      ) : (
      <div className="input-container">
        <input
          value={text}
          onChange={ handleChange }
          {...buttonName && {onKeyDown:handleKeyDown}}
          disabled={disabled}
          type="input"
          placeholder={placeholder}
        />
        {buttonName ? (<PrimaryButton onClick={handleClick}>{buttonName}</PrimaryButton>):(<></>)}
      </div>
    )}
    </div>
  )
};

InputTextField.defaultProps = {
  hidden: false,
  value: '',
  className: '',
  getText: () => ''
}

export default InputTextField;