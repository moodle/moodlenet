import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef } from 'react';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { elementFullyInViewPort } from '../../../helpers/utilities.js';
import './Searchbox.scss';
export const Searchbox = ({ 
// searchText,
placeholder, size, marginTop, 
// setSearchText,
setIsSearchboxInViewport, }) => {
    // const setSearchTextCB = useCallback<ChangeEventHandler<HTMLInputElement>>(
    //   ev => setSearchText(ev.currentTarget.value),
    //   [setSearchText],
    // )
    const searchboxRef = useRef(null);
    const setElementFullyInViewPort = useCallback(() => {
        if (setIsSearchboxInViewport) {
            searchboxRef.current && elementFullyInViewPort(searchboxRef.current, { marginTop: marginTop })
                ? setIsSearchboxInViewport(true)
                : setIsSearchboxInViewport(false);
        }
    }, [searchboxRef, marginTop, setIsSearchboxInViewport]);
    useEffect(() => {
        setIsSearchboxInViewport && window.addEventListener('scroll', setElementFullyInViewPort, true);
        return () => {
            setIsSearchboxInViewport && document.removeEventListener('scroll', setElementFullyInViewPort, true);
        };
    }, [setElementFullyInViewPort, setIsSearchboxInViewport]);
    return (_jsxs("div", { className: `searchbox size-${size}`, ref: searchboxRef, children: [_jsx(SearchIcon, {}), _jsx("label", { htmlFor: "search-text", className: "sr-only", hidden: true, children: "Search" }), _jsx("input", { className: "search-text", id: "search-text", placeholder: placeholder, autoFocus: true, defaultValue: '' })] }));
};
Searchbox.defaultProps = {
    size: 'small',
};
Searchbox.displayName = 'LandingPage';
export default Searchbox;
//# sourceMappingURL=Searchbox.js.map