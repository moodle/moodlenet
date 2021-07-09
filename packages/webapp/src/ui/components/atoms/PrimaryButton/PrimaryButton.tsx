import { FC } from "react";
import "./styles.scss";

export type PrimaryButtonProps = {}

export const PrimaryButton: FC<PrimaryButtonProps> = ({children}) => {
  

  return (
    <div className="primary-button">
      {children}
    </div>
  );
}

export default PrimaryButton;