import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { baseStyle } from '../../../styles/config.js';
import StandardHeader from '../../organisms/Header/Standard/Header.js';
// import { SettingsCtx } from '../../pages/Settings/SettingsContext.js'
import './MainLayout.scss';
export const MainLayout = ({ style, contentStyle, organization, children }) => {
    // const [collapsed, onCollapse] = useState(false)
    // const { routes } = useContext(RouterCtx)
    // const stateContext = useContext(StateContext)
    // const styleContext = useContext(SettingsCtx)
    return (_jsxs("div", { className: "main-layout", style: {
            ...style,
            ...baseStyle(),
            // ...getColorPalette(styleContext.appearanceData.color),
            // ...styleContext.style,
        }, children: [_jsx(StandardHeader, { organization: organization }), _jsxs("div", { style: { ...contentStyle }, className: "content", children: [children, _jsx("div", { className: "footer" })] })] }));
};
MainLayout.defaultProps = {};
export default MainLayout;
//# sourceMappingURL=MainLayout.js.map