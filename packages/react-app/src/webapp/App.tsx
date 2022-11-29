import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app-routes.js'
import { ProvideMainContexts } from './mainContextProviders.js'

// const reloadWebapp = (() => {
//   let to = 0
//   return () => {
//     clearTimeout(to)
//     to = window.setTimeout(() => location.reload(), 1000)
//   }
// })()

const App: FC = () => {
  // useEffect(() => {
  //   // if (process.env.NODE_ENV === 'development') {
  //   //   return
  //   // }
  //   priHttp.fetch<ReactAppExt>('@moodlenet/react-app', '0.1.0')('webapp/updated')().finally(reloadWebapp)
  // }, [])
  return (
    <BrowserRouter>
      <ProvideMainContexts>
        <AppRoutes />
      </ProvideMainContexts>
    </BrowserRouter>
  )
}

export default App
