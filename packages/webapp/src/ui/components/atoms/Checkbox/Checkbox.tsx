import { ChangeEventHandler, FC } from 'react'
import './styles.scss'

export type CheckboxProps = {
  label: string
  checked?: boolean
  name: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const Checkbox: FC<CheckboxProps> = ({
  label,
  checked,
  name,
  onChange,
}) => {
  return (
    <label className="container">
      <input
        name={name || label}
        onChange={onChange}
        type="checkbox"
        checked={checked}
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
