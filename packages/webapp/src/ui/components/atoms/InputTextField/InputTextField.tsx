import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import PrimaryButton from '../PrimaryButton/PrimaryButton'
import './styles.scss'

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
  value?: string | undefined | null
  getText?(text: string): void
  textAreaAttrs?: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
  inputAttrs?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  textAreaAutoSize?: boolean
  highlightWhenEmpty?: boolean
  highlight?: boolean
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
  textAreaAttrs,
  textAreaAutoSize,
  highlightWhenEmpty,
  highlight,
}) => {
  const [text, setText] = useState<string | undefined | null>(value)
  const [rows, setRows] = useState<number>(textAreaAutoSize ? 1 : 5)
  const textArea = useRef<HTMLTextAreaElement>(null)

  const checkRowChange = useCallback(() => {
    if (textAreaAutoSize && textArea && textArea.current) {
      textArea.current.style.height = 'fit-content'
      textArea.current.style.height = Math.ceil(textArea.current.scrollHeight / 10) * 10 + 'px'
    }
  }, [textAreaAutoSize])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      getText && getText(text ? text : '')
    }
    setRows(rows)
  }

  const handleClick = () => {
    getText && getText(text ? text : '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value)
    autoUpdate && getText && getText(e.currentTarget.value)
  }

  useEffect(() => {
    textArea && checkRowChange()
  }, [text, checkRowChange])

  useEffect(() => {
    setText(value)
  }, [value])

  return (
    <div
      className={`input-text-field ${className}${disabled ? ' disabled' : ''} ${
        (highlightWhenEmpty && !text) || highlight ? ' highlight' : ''
      }`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label ? <label>{label}</label> : <></>}
      {textarea ? (
        <div className={`textarea-container ${displayMode && 'display-mode'} ${!edit && 'not-editing'}`}>
          <textarea
            ref={textArea}
            className={`${displayMode && 'display-mode'} ${!edit && 'not-editing'}`}
            value={text ? text : ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || !edit}
            placeholder={placeholder}
            name="textarea"
            cols={40}
            rows={rows}
            {...textAreaAttrs}
          />
        </div>
      ) : (
        <div className={`input-container ${displayMode && 'display-mode'} ${!edit && 'not-editing'}`}>
          {edit !== undefined}
          <input
            className={`${displayMode && 'display-mode'} ${!edit && 'not-editing'}`}
            value={text ? text : ''}
            onChange={handleChange}
            {...(buttonName && { onKeyDown: handleKeyDown })}
            disabled={disabled || !edit}
            type="input"
            placeholder={placeholder}
            {...inputAttrs}
          />
          {buttonName ? <PrimaryButton onClick={handleClick}>{buttonName}</PrimaryButton> : <></>}
        </div>
      )}
    </div>
  )
}

InputTextField.defaultProps = {
  hidden: false,
  displayMode: false,
  placeholder: '',
  value: '',
  className: '',
  edit: true,
  getText: () => '',
  textAreaAutoSize: false,
}

export default InputTextField
