import { t } from "@lingui/macro";
import { FC, ReactNode } from "react";
import "./styles.scss";

export type InputTextFieldProps = {
  label?: string
  placeholder: string
  textarea?: boolean
  disabled?: boolean
  hidden?: boolean
  button?: ReactNode
  className?: string
}

export const InputTextField: FC<InputTextFieldProps> = ({
  label,
  placeholder,
  textarea,
  disabled,
  button,
  hidden,
  className
}) => { 
  return (
    <div 
      className={`input-text-field ${className} ${disabled ? 'disabled' : ''}`}
      style={{visibility: hidden ? 'hidden' : 'visible'}}
    >
      { label ? <label>{label}</label> : <></> }
      { textarea ? (
        <div className="textarea-container">
          <textarea 
            disabled={disabled}
            name="Text1" 
            cols={40} 
            rows={5}
          />
        </div>
      ) : (
      <div className="input-container">
        <input
          disabled={disabled}
          type="text"
          placeholder={t`${placeholder}`}
        />
        {button}
      </div>
    )}
    </div>
  );
}

InputTextField.defaultProps = {
  hidden: false,
  className: ''
}

export default InputTextField;