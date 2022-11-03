import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import './InputTextField.scss'

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
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({
      textarea: true
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
)

export const InputTextField: FC<InputTextFieldProps> = ({
  label,
  edit,
  displayMode,
  textAreaAutoSize,
  highlight,
  error,
  action,
  ...fieldProps
}) => {
  const { disabled, hidden, /* value, */ className = '' } = fieldProps
  if ('value' in fieldProps) {
    fieldProps.value = fieldProps.value ?? ''
  }
  const fieldElementRef = useRef<HTMLTextAreaElement>(null)
  const [errorLeaves, setErrorLeave] = useState<boolean>(false)
  const [currentError, setcurrentError] = useState<ReactNode>(undefined)

  const currTextAreaValue = fieldElementRef.current?.value

  useEffect(() => {
    const fieldElem = fieldElementRef.current
    if (!(textAreaAutoSize && fieldElem && fieldElem instanceof HTMLTextAreaElement)) {
      return
    }
    const fitTextArea = () => {
      if (fieldElem) {
        fieldElem.style.height = 'fit-content'
        fieldElem.style.height = Math.ceil(fieldElem.scrollHeight / 10) * 10 + 'px'
      }
    }
    fitTextArea()
    fieldElem.addEventListener('input', fitTextArea)
    return () => {
      fieldElem.removeEventListener('input', fitTextArea)
    }
  }, [textAreaAutoSize, currTextAreaValue, fieldElementRef])

  useEffect(() => {
    if (error && !disabled) {
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
  }, [error, label, disabled, setErrorLeave, currentError])

  return (
    <div
      className={`input-text-field ${className}${disabled ? ' disabled' : ''} ${
        fieldProps.textarea ? ' textarea' : 'text'
      } ${highlight || error ? ' highlight' : ''} ${
        !disabled && !errorLeaves && error ? 'enter-error' : ''
      } ${!disabled && errorLeaves ? 'leave-error' : ''}`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label ? <label>{label}</label> : <></>}
      {fieldProps.textarea ? (
        <div className={`textarea-container ${displayMode && 'display-mode'} ${edit && 'editing'}`}>
          <textarea
            ref={fieldElementRef}
            cols={40}
            rows={textAreaAutoSize ? 1 : 5}
            {..._removeTextAreaProp(fieldProps)}
            className={`${className} ${displayMode && 'display-mode'} 
               ${edit && 'editing'}
            `}
            disabled={disabled || !edit}
          />
          {action}
        </div>
      ) : (
        <div className={`input-container ${displayMode && 'display-mode'} ${edit && 'editing'}`}>
          <input
            {..._removeTextAreaProp(fieldProps)}
            className={`${className} ${displayMode && 'display-mode'} ${edit && 'editing'}`}
            disabled={disabled || !edit}
          />
          {action}
        </div>
      )}
      {currentError && !disabled && <div className={`error-msg`}>{currentError}</div>}
    </div>
  )
}

const _removeTextAreaProp = (_ = {}) => {
  const { ...rest } = _
  return rest
}

export default InputTextField
