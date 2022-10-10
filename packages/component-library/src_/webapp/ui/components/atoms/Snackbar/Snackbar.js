import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon, CloseRounded as CloseRoundedIcon, ErrorOutline as ErrorOutlineIcon, InfoOutlined as InfoOutlinedIcon, ReportProblemOutlined as ReportProblemOutlinedIcon, } from '@material-ui/icons';
import { useCallback, useEffect, useState } from 'react';
import Card from '../Card/Card.js';
import './styles.scss';
const stopPropagation = (event) => event.stopPropagation();
export const Snackbar = ({ onClose, showCloseButton, actions, icon, showIcon, style, buttonText, className, type, autoHideDuration, waitDuration, position, children, }) => {
    const [movementState, setMovementState] = useState('opening');
    const handleonClose = useCallback((event) => {
        event?.stopPropagation();
        setMovementState('closing');
        setTimeout(() => {
            setMovementState('closed');
            onClose && onClose();
        }, 100);
    }, [onClose]);
    useEffect(() => {
        if (waitDuration) {
            setMovementState('closed');
            const timer = setTimeout(() => {
                setMovementState('opening');
            }, waitDuration);
            return () => clearTimeout(timer);
        }
        return;
    }, [waitDuration, setMovementState]);
    useEffect(() => {
        if (autoHideDuration) {
            const timer = setTimeout(() => {
                handleonClose();
            }, waitDuration ? autoHideDuration + waitDuration : autoHideDuration);
            return () => clearTimeout(timer);
        }
        return;
    }, [autoHideDuration, waitDuration, handleonClose]);
    return (_jsxs(Card, { className: `snackbar ${className} type-${type} state-${movementState} position-${position}`, onClick: stopPropagation, style: style, children: [showIcon && (icon || type) && (_jsx("div", { className: "icon", children: icon
                    ? icon
                    : (() => {
                        switch (type) {
                            case 'error':
                                return _jsx(ErrorOutlineIcon, {});
                            case 'warning':
                                return _jsx(ReportProblemOutlinedIcon, {});
                            case 'info':
                                return _jsx(InfoOutlinedIcon, {});
                            case 'success':
                                return _jsx(CheckCircleOutlineOutlinedIcon, {});
                            default:
                                return null;
                        }
                    })() })), _jsx("div", { className: "content", children: children }), actions && _jsx("div", { className: "actions", children: actions }), showCloseButton && buttonText && (_jsx("div", { className: "close-button", onClick: handleonClose, children: buttonText ? _jsx("span", { children: buttonText }) : _jsx(CloseRoundedIcon, {}) }))] }));
};
Snackbar.defaultProps = {
    className: '',
    showIcon: true,
    position: 'bottom',
    showCloseButton: true,
};
export default Snackbar;
//# sourceMappingURL=Snackbar.js.map