import { CSSProperties, FC, ReactNode, useContext } from 'react'
import { baseMoodleColor, baseStyle } from '../../../styles/config'
import { getColorPalette } from '../../../styles/utilities'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import StandardHeader from '../../organisms/Header/Standard/Header'
import { SettingsCtx } from '../../pages/Settings/SettingsContext'
import './MainLayout.scss'
// import { StateContext } from './Providers'

export type MainLayoutProps = {
  style?: CSSProperties
  contentStyle?: CSSProperties
  children?: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ style, contentStyle, children }) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  const styleContext = useContext(SettingsCtx)

  return (
    <div
      className="main-layout"
      style={{
        ...style,
        ...baseStyle(),
        ...getColorPalette(baseMoodleColor),
        ...styleContext.style,
      }}
    >
      <StandardHeader />
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

MainLayout.defaultProps = {}
export default MainLayout
