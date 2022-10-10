import React, { ReactNode } from 'react'
import './InputTextField.scss'
export declare type InputTextFieldProps = {
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
export declare const InputTextField: React.ForwardRefExoticComponent<
  InputTextFieldProps &
    React.RefAttributes<HTMLInputElement | HTMLTextAreaElement | null | undefined>
>
export default InputTextField
//# sourceMappingURL=InputTextField.d.ts.map
