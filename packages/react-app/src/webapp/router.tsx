import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import routes from './routes'

const AppRouter = () => {
  //console.log('Routes: ', routes)
  return (
    <Router>
      <Routes>
        {routes.map(({ extId, extRoutingElement, extName, rootPath }) => {
          return (
            <Route path={rootPath ?? extName} key={`${extId}`} caseSensitive>
              {extRoutingElement}
            </Route>
          )
        })}
      </Routes>
    </Router>
  )
}

export default AppRouter
