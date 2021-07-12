import { FC } from "react";
import "./styles.scss";

export type CheckInputProps = {
  label: string
}

export const CheckInput: FC<CheckInputProps> = ({label}) => {
  

  return (
    <label className="container">
      <input type="checkbox"/>
      <span className="checkmark"></span>
      <span className="label">{label}</span>
    </label>
  );
}

export default CheckInput;