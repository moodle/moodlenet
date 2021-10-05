import { FC } from "react";
import "./styles.scss";

export type SecondaryButtonProps = {
  color?: 'orange' | 'grey' | 'red'
  className?: string
  disabled?: boolean
  onHoverColor?: 'blue' | 'grey' | 'red' | 'filled-red'
  onClick?(arg0: unknown): unknown
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({children, color, className, onHoverColor, disabled, onClick}) => {
  

  return (
    <div className={`secondary-button button ${className} ${color} hover-${onHoverColor} ${disabled ? 'disabled' : ''}`} onClick={!disabled ? onClick : () => {}}>
      {children}
    </div>
  );
}

SecondaryButton.defaultProps = { 
  color: 'orange',
  onHoverColor: 'blue'
}

export default SecondaryButton;