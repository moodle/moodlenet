import React, { forwardRef, ReactNode, useEffect, useRef, useState } from 'react'
import { useForwardedRef } from '../../../lib/useForwardedRef.mjs'
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
      isTextarea?: undefined | false
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({
      isTextarea: true
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
)

export const InputTextField = forwardRef<
  HTMLTextAreaElement | HTMLInputElement | null | undefined,
  InputTextFieldProps
>((props, forwRef) => {
  const {
    label,
    edit,
    displayMode,
    textAreaAutoSize,
    isTextarea,
    highlight,
    error,
    action,
    ...fieldProps
  } = props

  const { disabled, hidden, /* value, */ className = '' } = fieldProps
  if ('value' in fieldProps) {
    fieldProps.value = fieldProps.value ?? ''
  }

  const fieldElementRef = useForwardedRef(forwRef)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [errorLeaves, setErrorLeave] = useState<boolean>(false)
  const [currentError, setcurrentError] = useState<ReactNode>(undefined)

  const currTextAreaValue = fieldElementRef
    ? fieldElementRef.current?.value
    : textAreaRef.current?.value

  useEffect(() => {
    const fieldElem = fieldElementRef ? fieldElementRef.current : textAreaRef.current
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
  }, [textAreaAutoSize, currTextAreaValue, textAreaRef, fieldElementRef])

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
        isTextarea ? ' textarea' : 'text'
      } ${highlight || error ? ' highlight' : ''} ${
        !disabled && !errorLeaves && error ? 'enter-error' : ''
      } ${!disabled && errorLeaves ? 'leave-error' : ''}`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label ? <label>{label}</label> : <></>}
      {isTextarea ? (
        <div className={`textarea-container ${displayMode && 'display-mode'} ${edit && 'editing'}`}>
          <textarea
            ref={(fieldElementRef as React.RefObject<HTMLTextAreaElement>) ?? textAreaRef}
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
            ref={fieldElementRef as React.RefObject<HTMLInputElement>}
            {..._removeTextAreaProp(fieldProps)}
            className={`${className} ${displayMode && 'display-mode'} ${edit && 'editing'}`}
            disabled={disabled || !edit}
            style={{ backgroundColor: 'inherit' }}
          />
          {action}
        </div>
      )}
      {currentError && !disabled && <div className={`error-msg`}>{currentError}</div>}
    </div>
  )
})

const _removeTextAreaProp = (_ = {}) => {
  const { ...rest } = _
  return rest
}

InputTextField.defaultProps = { edit: true }
InputTextField.displayName = 'InputTextField'
export default InputTextField
