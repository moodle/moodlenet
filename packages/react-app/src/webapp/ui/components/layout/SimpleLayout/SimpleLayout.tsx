import { CSSProperties, FC, ReactNode, useContext } from 'react'
import { baseMoodleColor, baseStyle } from '../../../styles/config'
import { getColorPalette } from '../../../styles/utilities'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import MinimalisticHeader from '../../organisms/Header/Minimalistic/MinimalisticHeader'
import { SettingsCtx } from '../../pages/Settings/SettingsContext'
import './SimpleLayout.scss'
// import { StateContext } from './Providers'

export type SimpleLayoutProps = {
  style?: CSSProperties
  contentStyle?: CSSProperties
  page: 'login' | 'signup' | 'activation' | 'rootLogin'
  children?: ReactNode
}

const SimpleLayout: FC<SimpleLayoutProps> = ({ style, contentStyle, page, children }) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  const styleContext = useContext(SettingsCtx)

  return (
    <div
      className="simple-layout"
      style={{
        ...style,
        ...baseStyle(),
        ...getColorPalette(baseMoodleColor),
        ...styleContext.style,
      }}
    >
      <MinimalisticHeader page={page} />
      {/* <div className="side-menu">
          {routes.map(({ path, label }, i) => (
            <div key={`${path}_${i}`}>
              <Link to={path}>
                <span className="menu-item-link">{label}</span>
              </Link>
            </div>
          ))}
      </div> */}
      <div style={{ ...contentStyle }} className="content">
        {children}
        <div className="footer"></div>
      </div>
    </div>
  )
}

SimpleLayout.defaultProps = {}
export default SimpleLayout
