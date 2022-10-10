import { jsx as _jsx } from "react/jsx-runtime";
import './TertiaryButton.scss';
export const TertiaryButton = ({ className, disabled, children, color, onClick }) => {
    return (_jsx("div", { className: `tertiary-button ${className} ${disabled ? 'disabled' : ''} ${color ? color : ''}`, tabIndex: !disabled ? 0 : undefined, onClick: !disabled ? onClick : () => { }, onKeyDown: e => !disabled && onClick && e.key === 'Enter' && onClick(), children: children }));
};
export default TertiaryButton;
//# sourceMappingURL=TertiaryButton.js.map