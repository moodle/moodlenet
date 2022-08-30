import { Route } from 'react-router-dom'
import * as nodeHomePage from './NodeHomePage'

export default (
  <>
    <Route path={nodeHomePage.route} element={<nodeHomePage.Component />} />
  </>
)
