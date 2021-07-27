import { t } from "@lingui/macro";
import { FC } from "react";
import "./styles.scss";

export type InputTextFieldProps = {
  label?: string
  placeholder: string
  textarea?: boolean
  disabled?: boolean
}

export const InputTextField: FC<InputTextFieldProps> = ({
  label,
  placeholder,
  textarea,
  disabled
}) => {
  
  return (
    <div className={`input-text-field ${disabled ? 'disabled' : ''}`}>
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
      </div>
    )}
    </div>
  );
}

InputTextField.defaultProps = {}

export default InputTextField;