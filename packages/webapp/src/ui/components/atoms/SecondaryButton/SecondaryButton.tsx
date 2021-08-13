import { FC } from "react";
import "./styles.scss";

export type SecondaryButtonProps = {
  color?: 'default' | 'orange' | 'grey' | 'red'
  className?: string
  disabled?: boolean
  onHoverColor?: 'default' | 'red' | 'filled-red'
  onClick?(arg0: unknown): unknown
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({children, color, className, onHoverColor, disabled, onClick}) => {
  

  return (
    <div className={`secondary-button button ${className} ${color} hover-${onHoverColor} ${disabled ? 'disabled' : ''}`} onClick={onClick}>
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