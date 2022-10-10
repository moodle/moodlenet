import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import Card from '../Card/Card.js';
import './FloatingMenu.scss';
export const FloatingMenu = ({ menuContent, className, hover, hoverElement }) => {
    const [currentVisible, setCurrentVisible] = useState(false);
    const hoverElementRef = useRef(null);
    const [isOnHover, setIsOnHover] = useState(false);
    const switchMenu = (e) => {
        ;
        ['ArrowDown', 'ArrowUp'].includes(e.key) && expand();
        ['Enter'].includes(e.key) && setCurrentVisible(!currentVisible);
    };
    const closeMenu = (e) => {
        ;
        ['Tab', 'Enter'].includes(e.key) && e.shiftKey && close();
    };
    const closeMenuUp = (e) => {
        ;
        ['ArrowUp'].includes(e.key) && close();
        ['Tab'].includes(e.key) && e.shiftKey && close();
    };
    const closeMenuDown = (e) => {
        ;
        ['ArrowDown'].includes(e.key) && close();
        ['Tab'].includes(e.key) && !e.shiftKey && close();
    };
    const oneElementActions = (e) => {
        closeMenuUp(e);
        closeMenuDown(e);
    };
    const expand = () => {
        !currentVisible && setCurrentVisible(true);
    };
    const close = () => {
        currentVisible && setCurrentVisible(false);
    };
    const updatedMenuContent = menuContent.map((element, i) => {
        if (menuContent.length === 1) {
            return (_jsx("div", { tabIndex: i + 1, onKeyDown: oneElementActions, children: element }, i));
        }
        else if (i === 0) {
            return (_jsx("div", { tabIndex: i + 1, onKeyDown: closeMenuUp, children: element }, i));
        }
        else if (menuContent.length - 1 === i) {
            return (_jsx("div", { tabIndex: i + 1, className: "last element", children: element }, i));
        }
        else {
            return (_jsx("div", { tabIndex: i + 1, children: element }, i));
        }
    });
    const handleBlur = (e) => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => !currentTarget.contains(document.activeElement) && close());
    };
    const handleOnMouseDown = (e) => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => {
            if (!(currentTarget.contains(document.activeElement) && currentTarget !== document.activeElement)) {
                currentVisible ? close() : expand();
            }
        });
        e.stopPropagation();
    };
    useEffect(() => {
        hoverElementRef?.current?.setAttribute('inert', '');
    }, [hoverElementRef]);
    return (_jsxs("div", { className: `floating-menu ${className}`, onBlur: e => handleBlur(e), onFocus: expand, onMouseDown: e => handleOnMouseDown(e), tabIndex: 0, children: [_jsx("div", { className: "hover-element", ref: hoverElementRef, onKeyUp: switchMenu, onKeyDown: closeMenu, onMouseEnter: () => hover && expand(), onMouseLeave: () => hover && close(), children: hoverElement }), _jsx("div", { className: `menu ${currentVisible || (hover && isOnHover) ? 'visible' : ''}`, style: {
                    top: hoverElementRef.current?.clientHeight && `${hoverElementRef.current?.clientHeight}px`,
                }, onMouseEnter: () => hover && setIsOnHover(true), onMouseLeave: () => hover && setIsOnHover(false), onClick: close, children: _jsx(Card, { className: "content", children: updatedMenuContent }) })] }));
};
FloatingMenu.defaultProps = {
    hover: false,
};
export default FloatingMenu;
//# sourceMappingURL=FloatingMenu.js.map