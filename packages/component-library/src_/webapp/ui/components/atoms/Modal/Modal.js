import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CloseRounded as CloseRoundedIcon } from '@material-ui/icons';
import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Card from '../Card/Card.js';
import './Modal.scss';
class Portal extends React.Component {
    static el = (() => {
        const _el = document.createElement('div');
        _el.setAttribute('class', 'modal-portal');
        _el.style.display = 'none';
        document.body.prepend(_el);
        return _el;
    })();
    componentDidMount() {
        Portal.el.style.display = 'block';
    }
    componentWillUnmount() {
        Portal.el.style.display = 'none';
    }
    render() {
        return ReactDOM.createPortal(this.props.children, Portal.el);
    }
}
const stopPropagation = (event) => event.stopPropagation();
export const Modal = ({ onClose, title, actions, style, className, closeButton, children }) => {
    const handleonClose = useCallback((event) => {
        event.stopPropagation();
        onClose();
    }, [onClose]);
    useEffect(() => {
        const handleEvent = ({ key }) => {
            if (key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keyup', handleEvent);
        return () => document.removeEventListener('keyup', handleEvent);
    }, [onClose]);
    return (_jsx(Portal, { children: _jsx("div", { className: `modal-container ${className}`, onMouseDown: handleonClose, children: _jsxs(Card, { className: `modal`, onMouseDown: stopPropagation, style: { ...style, ...(!children && { gap: '25px' }) }, children: [(title || closeButton) && (_jsxs("div", { className: "modal-header", children: [title && _jsx("div", { className: "title", children: title }), closeButton && (_jsx("div", { className: "close-button", onClick: handleonClose, children: _jsx(CloseRoundedIcon, {}) }))] })), children && _jsx("div", { className: "content", children: children }), actions && _jsx("div", { className: "actions", children: actions })] }) }) }));
};
Modal.defaultProps = {
    className: '',
    closeButton: true,
};
export default Modal;
//# sourceMappingURL=Modal.js.map