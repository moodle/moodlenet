import { CSSProperties, FC, ReactNode } from 'react'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import MinimalisticHeader from '../organisms/Header/Minimalistic/MinimalisticHeader'
import StandardHeader from '../organisms/Header/Standard/Header'
import './MainLayout.scss'
// import { StateContext } from './Providers'

export type MainLayoutProps = {
  headerType?: 'default' | 'minimalistic'
  style?: CSSProperties
  children?: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ headerType, style, children }) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)
  // console.log({ routes })

  // const stateContext = useContext(StateContext)

  return (
    <div className="main-layout" style={style}>
      {headerType === 'default' && <StandardHeader />}
      {headerType === 'minimalistic' && <MinimalisticHeader />}
      {/* <div className="side-menu">
          {routes.map(({ path, label }, i) => (
            <div key={`${path}_${i}`}>
              <Link to={path}>
                <span className="menu-item-link">{label}</span>
              </Link>
            </div>
          ))}
      </div> */}
      <div style={{}} className="content">
        {children}
        <div className="footer"></div>
      </div>
    </div>
  )
}

MainLayout.defaultProps = { headerType: 'default' }
export default MainLayout
