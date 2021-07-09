import { FC } from "react";
import "./styles.scss";

export type SecondaryButtonProps = {
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({children}) => {
  

  return (
    <div className="secondary-button">
      {children}
    </div>
  );
}

export default SecondaryButton;