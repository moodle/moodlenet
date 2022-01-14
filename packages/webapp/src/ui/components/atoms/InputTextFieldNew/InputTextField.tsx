import React, { FC, ReactNode, useEffect, useRef } from 'react'
import './styles.scss'

export type InputTextFieldProps = {
  label?: string
  edit?: boolean
  displayMode?: boolean
  textAreaAutoSize?: boolean
  highlight?: boolean
  action?: ReactNode
} & (
  | ({
      textarea?: undefined | false
    } & React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >)
  | ({
      textarea: true
    } & React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >)
)

export const InputTextField: FC<InputTextFieldProps> = (props) => {
  const {
    label,
    edit,
    displayMode,
    textAreaAutoSize,
    highlight,
    action,
    ...fieldProps
  } = props
  const { disabled, hidden, value, className = '' } = fieldProps ?? {}
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const currTextAreaValue =
    textAreaRef.current && (value ?? textAreaRef.current?.value)

  useEffect(() => {
    const textAreaElem = textAreaRef.current
    if (!(textAreaAutoSize && textAreaElem)) {
      return
    }
    const fitTextArea = () => {
      textAreaElem.style.height = 'fit-content'
      textAreaElem.style.height =
        Math.ceil(textAreaElem.scrollHeight / 10) * 10 + 'px'
    }
    textAreaElem.addEventListener('input', fitTextArea)
    return () => {
      textAreaElem.removeEventListener('input', fitTextArea)
    }
  }, [textAreaAutoSize, currTextAreaValue])

  return (
    <div
      className={`input-text-field ${className}${disabled ? ' disabled' : ''} ${
        highlight ? ' highlight' : ''
      }`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label ? <label>{label}</label> : <></>}
      {fieldProps.textarea ? (
        <div
          className={`textarea-container ${displayMode && 'display-mode'} ${
            !edit && 'not-editing'
          }`}
        >
          <textarea
            ref={textAreaRef}
            className={`${className} ${displayMode && 'display-mode'} ${
              !edit && 'not-editing'
            }`}
            cols={40}
            rows={textAreaAutoSize ? 1 : 5}
            {...fieldProps}
          />
          {action}
        </div>
      ) : (
        <div
          className={`input-container ${displayMode && 'display-mode'} ${
            !edit && 'not-editing'
          }`}
        >
          <input
            className={`${className} ${displayMode && 'display-mode'} ${
              !edit && 'not-editing'
            }`}
            disabled={disabled || !edit}
            {...fieldProps}
          />
          {action}
        </div>
      )}
    </div>
  )
}

export default InputTextField
