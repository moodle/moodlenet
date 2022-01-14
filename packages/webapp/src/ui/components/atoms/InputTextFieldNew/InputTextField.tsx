import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import './styles.scss'

export type InputTextFieldProps = {
  label?: string
  edit?: boolean
  displayMode?: boolean
  textAreaAutoSize?: boolean
  highlight?: boolean
  error?: ReactNode
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
    error,
    action,
    ...fieldProps
  } = props
  const { disabled, hidden, value, className = '' } = fieldProps ?? {}
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [errorLeaves, setErrorLeave] = useState<boolean>(false)
  const [currentError, setcurrentError] = useState<ReactNode>(undefined)

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

  useEffect(() => {
    if (error) {
      setErrorLeave(false)
      setcurrentError(error)
    } else {
      if (currentError) {
        setErrorLeave(true)
        setTimeout(() => {
          setcurrentError(undefined)
        }, 500)
      } else {
        setcurrentError(undefined)
      }
    }
  }, [error, setErrorLeave, currentError])

  return (
    <div
      className={`input-text-field ${className}${disabled ? ' disabled' : ''} ${
        highlight || error ? ' highlight' : ''
      } ${!errorLeaves && error ? 'enter-error' : ''} ${
        errorLeaves ? 'leave-error' : ''
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
            cols={40}
            rows={textAreaAutoSize ? 1 : 5}
            {...fieldProps}
            className={`${className} ${displayMode && 'display-mode'} ${
              !edit && 'not-editing'
            }`}
            disabled={disabled || !edit}
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
            {...fieldProps}
            className={`${className} ${displayMode && 'display-mode'} ${
              !edit && 'not-editing'
            }`}
            disabled={disabled || !edit}
          />
          {action}
        </div>
      )}
      {currentError && !disabled && (
        <div className={`error-msg`}>{currentError}</div>
      )}
    </div>
  )
}

export default InputTextField
