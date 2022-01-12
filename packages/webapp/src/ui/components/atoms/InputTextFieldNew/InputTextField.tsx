import React, { FC, useEffect, useRef } from 'react'
import './styles.scss'

export type InputTextFieldProps = {
  label?: string
  className?: string
  edit?: boolean
  displayMode?: boolean
  textAreaAutoSize?: boolean
  highlight?: boolean
} & (
  | {
      textarea?: undefined | false
      fieldProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >
    }
  | {
      textarea: true
      fieldProps?: React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >
    }
)

export const InputTextField: FC<InputTextFieldProps> = (props) => {
  const {
    label,
    className,
    edit,
    displayMode,
    textAreaAutoSize,
    highlight,
    children,
  } = props
  const { disabled, hidden, value } = props.fieldProps ?? {}
  const fieldElementGivenClassName = props.fieldProps?.className ?? ''
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
      {props.textarea ? (
        <div
          className={`textarea-container ${displayMode && 'display-mode'} ${
            !edit && 'not-editing'
          }`}
        >
          <textarea
            ref={textAreaRef}
            className={`${fieldElementGivenClassName} ${
              displayMode && 'display-mode'
            } ${!edit && 'not-editing'}`}
            cols={40}
            rows={textAreaAutoSize ? 1 : 5}
            {...props.fieldProps}
          />
          {children}
        </div>
      ) : (
        <div
          className={`input-container ${displayMode && 'display-mode'} ${
            !edit && 'not-editing'
          }`}
        >
          <input
            className={`${fieldElementGivenClassName} ${
              displayMode && 'display-mode'
            } ${!edit && 'not-editing'}`}
            disabled={disabled || !edit}
            {...props.fieldProps}
          />
          {children}
        </div>
      )}
    </div>
  )
}

export default InputTextField
