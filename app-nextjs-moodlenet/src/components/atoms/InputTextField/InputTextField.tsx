"use client"
import type React from 'react'
import type { ReactNode } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useForwardedRef } from '../../../lib/useForwardedRef.mjs'
import './InputTextField.scss'

export type InputTextFieldProps = {
  label?: string
  edit?: boolean
  noBorder?: boolean
  textAreaAutoSize?: boolean
  highlight?: boolean
  error?: ReactNode
  rightSlot?: ReactNode
  leftSlot?: ReactNode
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
    noBorder,
    textAreaAutoSize,
    isTextarea,
    highlight,
    error,
    rightSlot,
    leftSlot,
    ...fieldProps
  } = props

  const { disabled, hidden, /* value, */ className = '' } = fieldProps
  if ('value' in fieldProps) {
    fieldProps.value = fieldProps.value ?? ''
  }

  const fieldElementRef = useForwardedRef(forwRef)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [errorLeave, setErrorLeave] = useState<boolean>(false)
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
        fieldElem.style.height = fieldElem.scrollHeight + 1 + 'px'
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
        noBorder ? 'no-border underline' : ''
      } ${isTextarea ? ' textarea' : 'text'} ${highlight || error ? ' highlight' : ''} ${
        !disabled && !errorLeave && error ? 'enter-error' : ''
      } ${!disabled && errorLeave ? 'leave-error' : ''}`}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      hidden={hidden}
    >
      {label ? <label>{label}</label> : <></>}
      {isTextarea ? (
        <div className={`textarea-container ${noBorder ? 'no-border' : ''} ${edit && 'editing'}`}>
          {leftSlot}
          <textarea
            ref={(fieldElementRef as React.RefObject<HTMLTextAreaElement>) ?? textAreaRef}
            cols={40}
            rows={textAreaAutoSize ? 1 : 5}
            {..._removeTextAreaProp(fieldProps)}
            className={`${className} ${noBorder && 'no-border'} 
               ${edit && 'editing'}
            `}
            disabled={disabled || !edit}
          />
          {rightSlot}
        </div>
      ) : (
        <div className={`input-container ${noBorder ? 'no-border' : ''} ${edit && 'editing'}`}>
          {leftSlot}
          <input
            ref={fieldElementRef as React.RefObject<HTMLInputElement>}
            {..._removeTextAreaProp(fieldProps)}
            className={`${className} ${noBorder ? 'no-border' : ''} ${edit && 'editing'}`}
            disabled={disabled || !edit}
            style={{ backgroundColor: 'inherit' }}
          />
          {rightSlot}
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
