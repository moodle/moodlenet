import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import './ListCard.scss';
export const ListCard = ({ className, content, direction, title, minGrid, maxHeight, 
// maxRows,
noCard, actions, }) => {
    const contentDiv = useRef(null);
    const element = useRef(null);
    const contentWithKeys = content.map((el, i) => {
        const elementWithKey = [
            _jsx("div", { className: 'element', ...(i === 0 && { ref: element }), children: el }, i),
        ];
        return elementWithKey;
    });
    // const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)
    // const contentDivCurr = contentDiv.current
    // const elementCurr = element.current
    // useLayoutEffect(() => {
    //   if (!(maxRows && contentDivCurr && elementCurr)) {
    //     return
    //   }
    //   const gap = getComputedStyle(contentDivCurr).gap
    //   const elementHeight = elementCurr.clientHeight
    //   const totalMaxHeight = elementHeight
    //     ? maxRows * elementHeight + parseInt(gap) * (maxRows - 1) + 10
    //     : undefined
    //   setMaxHeight(totalMaxHeight)
    // }, [elementCurr, setMaxHeight, className, contentDivCurr, maxRows])
    // console.log('############ ', className.toUpperCase())
    // console.log(contentDiv.current?.clientWidth)
    // console.log(minGrid)
    // console.log(contentDiv.current?.clientWidth && minGrid && contentDiv.current?.clientWidth / minGrid)
    return (_jsxs("div", { className: `list-card ${className} ${noCard ? 'no-card' : ''}`, children: [title && _jsx("div", { className: "title", children: title }), actions?.element && actions.position === 'start' && _jsx("div", { className: "action", children: actions.element }), contentWithKeys && contentWithKeys.length > 0 && (_jsx("div", { className: `content ${direction} ${direction === 'horizontal' ? 'scroll' : ''} ${minGrid ? 'grid' : ''}`, style: {
                    ...(maxHeight && { maxHeight: `${maxHeight}px` }),
                    // maxHeight: maxHeight ? `${maxHeight}px` : 'auto',
                    gridTemplateColumns: minGrid && `repeat(auto-fill, minmax(${minGrid}px, 1fr))`,
                }, ref: contentDiv, children: contentWithKeys })), actions?.element && actions.position === 'end' && _jsx("div", { className: "action", children: actions.element })] }));
};
ListCard.defaultProps = {
    noCard: false,
    direction: 'vertical',
};
export default ListCard;
//# sourceMappingURL=ListCard.js.map