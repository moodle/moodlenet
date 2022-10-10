import { CSSProperties, FC, ReactNode } from 'react'
import { baseMoodleColor, baseStyle } from '../../../styles/config.js'
import { getColorPalette } from '../../../styles/utilities.js'
import { Organization } from '../../../types.js'
// import { StateContext } from '../../../../component-library-lib/devModeContextProvider'
import MinimalisticHeader from '../../organisms/Header/Minimalistic/MinimalisticHeader.js'
// import { SettingsCtx } from '../../pages/Settings/SettingsContext.js'
import './SimpleLayout.scss'
// import { StateContext } from './Providers'

export type SimpleLayoutProps = {
  style?: CSSProperties
  contentStyle?: CSSProperties
  page: 'login' | 'signup' | 'activation' | 'rootLogin'
  organization: Organization
  children?: ReactNode
}

const SimpleLayout: FC<SimpleLayoutProps> = ({
  style,
  contentStyle,
  page,
  organization,
  children,
}) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)

  // const stateContext = useContext(StateContext)

  // const styleContext = useContext(SettingsCtx)

  return (
    <div
      className="simple-layout"
      style={{
        ...style,
        ...baseStyle(),
        ...getColorPalette(baseMoodleColor),
        // ...styleContext.style,
      }}
    >
      <MinimalisticHeader page={page} organization={organization} />
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
