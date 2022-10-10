import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import './HeaderTitle.scss';
export const HeaderTitle = ({ logo, smallLogo, url, }) => {
    return (_jsx(Link, { to: url, style: { textDecoration: 'none' }, children: _jsxs("div", { className: "header-title", children: [_jsx("img", { className: "logo big", src: logo, alt: "Logo" }), _jsx("img", { className: "logo small", src: smallLogo, alt: "small Logo" })] }) }));
};
export default HeaderTitle;
//# sourceMappingURL=HeaderTitle.js.map