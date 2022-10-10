import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { baseMoodleColor, baseStyle } from '../../../styles/config.js'
import { getColorPalette } from '../../../styles/utilities.js'
// import { StateContext } from '../../../../component-library-lib/devModeContextProvider'
import MinimalisticHeader from '../../organisms/Header/Minimalistic/MinimalisticHeader.js'
// import { SettingsCtx } from '../../pages/Settings/SettingsContext.js'
import './SimpleLayout.scss'
const SimpleLayout = ({ style, contentStyle, page, organization, children }) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)
  // const stateContext = useContext(StateContext)
  // const styleContext = useContext(SettingsCtx)
  return _jsxs('div', {
    className: 'simple-layout',
    style: {
      ...style,
      ...baseStyle(),
      ...getColorPalette(baseMoodleColor),
      // ...styleContext.style,
    },
    children: [
      _jsx(MinimalisticHeader, { page: page, organization: organization }),
      _jsxs('div', {
        style: { ...contentStyle },
        className: 'content',
        children: [children, _jsx('div', { className: 'footer' })],
      }),
    ],
  })
}
SimpleLayout.defaultProps = {}
export default SimpleLayout
//# sourceMappingURL=SimpleLayout.js.map
