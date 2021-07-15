import { FC } from "react";
import "./styles.scss";

export type CheckboxProps = {
  label: string
  checked?: boolean
}

export const Checkbox: FC<CheckboxProps> = ({label, checked}) => {
  

  return (
    <label className="container">
      <input onClick={() => checked=!checked} type="checkbox" defaultChecked={checked}/>
      <span className="checkmark"></span>
      <span className="label">{label}</span>
    </label> 
  );
}

Checkbox.defaultProps = {
  checked: false
}

export default Checkbox;