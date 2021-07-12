import { FC } from "react";
import "./styles.scss";

export type CheckboxProps = {
  label: string
}

export const Checkbox: FC<CheckboxProps> = ({label}) => {
  

  return (
    <label className="container">
      <input type="checkbox"/>
      <span className="checkmark"></span>
      <span className="label">{label}</span>
    </label>
  );
}

export default Checkbox;