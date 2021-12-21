import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import './styles.scss'

export type InputTextFieldProps = {
  label?: string
  placeholder?: string
  textarea?: boolean
  disabled?: boolean
  hidden?: boolean
  autoUpdate?: boolean
  className?: string
  edit?: boolean
  type?: 'text' | 'password' | 'email' | 'number' | 'url'
  error?: { msg: string | null | undefined }
  displayMode?: boolean
  value?: string | undefined | null
  getText?(text: string): void
  textAreaAttrs?: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >
  inputAttrs?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
  textAreaAutoSize?: boolean
  highlightWhenEmpty?: boolean
  highlight?: boolean
}

export const InputTextField: FC<InputTextFieldProps> = ({
  label,
  placeholder,
  textarea,
  disabled,
  hidden,
  autoUpdate,
  className,
  error,
  edit,
  type,
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
      // console.log(textArea.current.scrollHeight)
      textArea.current.style.height =
        Math.ceil(textArea.current.scrollHeight / 10) * 10 + 'px'
    }
  }, [textAreaAutoSize])

  const handleKeyDown = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      getText && getText(text ? text : '')
    }
    setRows(rows)
  }

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
        (highlightWhenEmpty && !text) || highlight || error?.msg
          ? ' highlight'
          : ''
      }`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label ? <label>{label}</label> : <></>}
      <div
        className={`${textarea ? 'textarea-container' : 'input-container'}  ${
          displayMode && 'display-mode'
        } ${!edit && 'not-editing'}`}
      >
        {textarea ? (
          <textarea
            ref={textArea}
            className={`${displayMode && 'display-mode'} ${
              !edit && 'not-editing'
            }`}
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
        ) : (
          <input
            className={`${displayMode && 'display-mode'} ${
              !edit && 'not-editing'
            }`}
            value={text ? text : ''}
            onChange={handleChange}
            disabled={disabled || !edit}
            type={type}
            placeholder={placeholder}
            {...inputAttrs}
          />
        )}
      </div>
      {error && <div className="error-msg">{error.msg}</div>}
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
  type: 'text',
}

export default InputTextField
