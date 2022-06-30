import { FC, ReactNode } from 'react'
// import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import Header from '../organisms/Header/Header'
import MinimalisticHeader from '../organisms/MinimalisticHeader/MinimalisticHeader'
import './MainLayout.scss'
// import { StateContext } from './Providers'

export type MainLayoutProps = {
  headerType?: 'default' | 'minimalistic'
  children?: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ headerType, children }) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)
  // console.log({ routes })

  // const stateContext = useContext(StateContext)

  return (
    <div className="main-layout">
      {headerType === 'default' && <Header />}
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
      <div className="content">
        {children}
        <div className="footer"></div>
      </div>
    </div>
  )
}

MainLayout.defaultProps = { headerType: 'default' }
export default MainLayout
