import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Cached as CachedIcon, CloseRounded as CloseRoundedIcon, DeleteOutline as DeleteOutlineIcon, Edit as EditIcon, } from '@material-ui/icons';
import './RoundButton.scss';
export const RoundButton = ({ className, type, color, onHoverColor, tabIndex, abbrTitle, onKeyUp, icon, onClick, }) => {
    const svgClassName = `color-${color} hover-${onHoverColor}`;
    return (_jsx("abbr", { className: `round-button ${className}`, title: abbrTitle, children: _jsxs("div", { className: `content`, onClick: onClick, onKeyUp: e => e.key === onKeyUp?.key && onKeyUp.func(), tabIndex: tabIndex, children: [icon && icon, !icon && (_jsxs(_Fragment, { children: [type === 'cross' && _jsx(CloseRoundedIcon, { className: svgClassName }), type === 'trash' && _jsx(DeleteOutlineIcon, { className: svgClassName }), type === 'edit' && _jsx(EditIcon, { className: svgClassName }), type === 'refresh' && _jsx(CachedIcon, { className: svgClassName })] }))] }) }));
};
RoundButton.defaultProps = {
    type: 'cross',
    color: 'gray',
    onHoverColor: 'gray',
};
export default RoundButton;
//# sourceMappingURL=RoundButton.js.map