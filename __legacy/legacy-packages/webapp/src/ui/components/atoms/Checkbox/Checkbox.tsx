import { ChangeEventHandler, FC } from 'react'
import './styles.scss'

export type CheckboxProps = {
  label: string
  checked?: boolean
  disabled?: boolean
  name: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  checked,
  disabled,
  name,
  onChange,
}) => {
  return (
    <label
      className={`container ${checked ? 'checked' : 'not-checked'} ${
        disabled ? 'disabled' : ''
      }`}
    >
      <input
        name={name || label}
        onChange={onChange}
        type="checkbox"
        checked={checked}
        disabled={disabled}
      />
      <span className="checkmark"></span>
      <span className="label">{label}</span>
    </label>
  )
}

Checkbox.defaultProps = {
  checked: false,
}

export default Checkbox
