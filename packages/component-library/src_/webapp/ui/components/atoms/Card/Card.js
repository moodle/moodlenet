import { jsx as _jsx } from "react/jsx-runtime";
import './Card.scss';
export const Card = ({ onClick, onMouseDown, className, noCard, hover, style, hideBorderWhenSmall, removePaddingWhenSmall, children, }) => {
    return (_jsx("div", { className: `card ${className ? className : ''} ${hideBorderWhenSmall ? 'hide-border' : ''} ${noCard ? 'no-card' : ''} ${removePaddingWhenSmall ? 'remove-padding' : ''} ${hover ? 'hover' : ''}`, style: style, onClick: onClick, onMouseDown: onMouseDown, children: children }));
};
Card.defaultProps = {
    removePaddingWhenSmall: false,
};
export default Card;
//# sourceMappingURL=Card.js.map