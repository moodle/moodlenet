import { FC } from "react";
import "./styles.scss";

export type SecondaryButtonProps = {
  type?: 'default' | 'orange' | 'grey'
  onClick?(arg0: unknown): unknown
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({children, type, onClick}) => {
  

  return (
    <div className={`secondary-button ${type}`} onClick={onClick}>
      {children}
    </div>
  );
}

SecondaryButton.defaultProps = { type : 'default'}

export default SecondaryButton;