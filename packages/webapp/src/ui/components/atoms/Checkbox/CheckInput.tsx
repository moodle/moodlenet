import { FC } from "react";
import "./styles.scss";

export type CheckboxProps = {
  label: string
  checked?: boolean
}

export const Checkbox: FC<CheckboxProps> = ({label, checked}) => {
  

  return (
    <label className="container">
      <input type="checkbox" {...(checked ? {checked} : '')}/>
      <span className="checkmark"></span>
      <span className="label">{label}</span>
    </label>
  );
}

export default Checkbox;