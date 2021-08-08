import React, { FC, useEffect, useState } from "react";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import "./styles.scss";

export type InputTextFieldProps = {
  label?: string
  placeholder?: string
  textarea?: boolean
  disabled?: boolean
  hidden?: boolean
  autoUpdate?: boolean
  buttonName?: string
  className?: string
  edit?: boolean
  displayMode?: boolean
  value?: string | undefined |null
  getText?(text: string): void
  textAreaAttrs?:React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
  inputAttrs?:React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
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
  edit,
  displayMode,
  value,
  getText,
  inputAttrs,
  textAreaAttrs
}) => { 
  const [text, setText] = useState<string |undefined | null>(value)

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

  useEffect(() => {
    setText(value)
  }, [value]);


  return (
    <div 
      className={`input-text-field ${className} ${disabled ? 'disabled' : ''}`}
      style={{visibility: hidden ? 'hidden' : 'visible'}}
      hidden={hidden}
    >
      { label ? <label>{label}</label> : <></> }
      { textarea ? (
        <div className={`textarea-container ${displayMode && 'display-mode'} ${!edit && 'not-editing'}`}>
          <textarea 
            className={`${displayMode && 'display-mode'} ${!edit && 'not-editing'}`}
            value={text ? text : ''}
            onChange={ handleChange }
            onKeyDown={ handleKeyDown }
            disabled={disabled || !edit}
            placeholder={placeholder}
            name="textarea" 
            cols={40} 
            rows={5}
            {...textAreaAttrs}
          />
        </div>
      ) : (
        <div className={`input-container ${displayMode && 'display-mode'} ${!edit && 'not-editing'}`}>
          {edit !== undefined}
          <input
            className={`${displayMode && 'display-mode'} ${!edit && 'not-editing'}`}
            value={text ? text : ''}
            onChange={ handleChange }
            {...buttonName && {onKeyDown:handleKeyDown}}
            disabled={disabled || !edit}
            color="input"
            placeholder={placeholder}
            {...inputAttrs}
          />
          {buttonName ? (<PrimaryButton onClick={handleClick}>{buttonName}</PrimaryButton>):(<></>)}
        </div>
      )}
    </div>
  )
};

InputTextField.defaultProps = {
  hidden: false,
  displayMode: false,
  placeholder: '',
  value: '',
  className: '',
  edit: true,
  getText: () => ''
}

export default InputTextField;