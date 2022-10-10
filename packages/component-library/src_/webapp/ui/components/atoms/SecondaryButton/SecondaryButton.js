import { jsx as _jsx } from "react/jsx-runtime";
import './SecondaryButton.scss';
export const SecondaryButton = ({ children, color, className, disabled, onHoverColor, onClick, ...props }) => {
    return (_jsx("button", { className: `secondary-button button ${className} ${color} hover-${onHoverColor} ${disabled ? 'disabled' : ''}`, tabIndex: !disabled ? 0 : undefined, onClick: !disabled ? onClick : () => { }, onKeyDown: e => !disabled && onClick && e.key === 'Enter' && onClick(), ...props, children: children }));
};
SecondaryButton.defaultProps = {
    color: 'black',
};
export default SecondaryButton;
//# sourceMappingURL=SecondaryButton.js.map