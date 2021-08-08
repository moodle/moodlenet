import { FC } from "react";
import "./styles.scss";

export type SecondaryButtonProps = {
  color?: 'default' | 'orange' | 'grey'
  className?: string
  onHoverColor?: 'default' | 'red'
  onClick?(arg0: unknown): unknown
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({children, color, className, onHoverColor, onClick}) => {
  

  return (
    <div className={`secondary-button button ${className} ${color} hover-${onHoverColor}`} onClick={onClick}>
      {children}
    </div>
  );
}

SecondaryButton.defaultProps = { 
  color: 'default',
  className: '',
  onHoverColor: 'default'
}

export default SecondaryButton;