import { FC } from "react";
import "./styles.scss";

export type SecondaryButtonProps = {
  type?: 'default' | 'orange'
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({children, type}) => {
  

  return (
    <div className={`secondary-button ${type}`}>
      {children}
    </div>
  );
}

SecondaryButton.defaultProps = { type : 'default'}

export default SecondaryButton;