import { FC, PropsWithChildren, useContext } from 'react'
import { StateContext } from '../../../../react-app-lib/devModeContextProvider'
import Header from '../organisms/Header/Header'
import './MainLayout.scss'
// import { StateContext } from './Providers'

const MainLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  // const [collapsed, onCollapse] = useState(false)
  // const { routes } = useContext(RouterCtx)
  // console.log({ routes })

  const stateContext = useContext(StateContext)

  return (
    <div className="main-layout">
      <Header devMode={stateContext?.devMode} setDevMode={stateContext?.setDevMode} />
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

export default MainLayout
