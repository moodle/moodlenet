import { jsx as _jsx } from "react/jsx-runtime";
import './PrimaryButton.scss';
export const PrimaryButton = ({ children, className, color, onHoverColor, noHover, disabled, onClick, ...props }) => {
    return (_jsx("button", { className: `primary-button button ${className} ${onHoverColor} ${disabled ? 'disabled' : ''} ${color}`, tabIndex: !disabled ? 0 : undefined, style: { pointerEvents: noHover ? 'none' : 'unset' }, onClick: !disabled ? onClick : undefined, onKeyDown: e => !disabled && onClick && e.key === 'Enter' && onClick(), ...props, children: children }));
};
PrimaryButton.defaultProps = {
    color: '',
    onHoverColor: '',
};
export default PrimaryButton;
//# sourceMappingURL=PrimaryButton.js.map