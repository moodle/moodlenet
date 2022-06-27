import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import routes from './routes'
import MainLayout from './ui/components/layout/MainLayout'

const AppRouter = () => {
  //console.log('Routes: ', routes)
  return (
    <Router>
      <MainLayout>
        <Routes>
          {routes.map(({ extId, extRoutingElement, extName, rootPath }) => {
            return (
              <Route path={rootPath ?? extName} key={`${extId}`} caseSensitive>
                {extRoutingElement}
              </Route>
            )
          })}
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default AppRouter
