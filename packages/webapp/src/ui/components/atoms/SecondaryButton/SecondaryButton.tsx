import { FC } from "react";
import "./styles.scss";

export type SecondaryButtonProps = {
  type?: 'default' | 'orange' | 'grey'
  className?: string
  onHoverColor?: 'default' | 'red'
  onClick?(arg0: unknown): unknown
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({children, type, className, onHoverColor, onClick}) => {
  

  return (
    <div className={`secondary-button ${className} ${type} hover-${onHoverColor}`} onClick={onClick}>
      {children}
    </div>
  );
}

SecondaryButton.defaultProps = { 
  type: 'default',
  className: '',
  onHoverColor: 'default'
}

export default SecondaryButton;