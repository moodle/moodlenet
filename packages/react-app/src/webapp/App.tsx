import { FC, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ReactAppExt } from '..'
import priHttp from '../react-app-lib/pri-http'
import AppRoutes from './app-routes'
import { ProvideMainContexts } from './mainContextProviders'

const reloadWebapp = (() => {
  let to = 0
  return () => {
    clearTimeout(to)
    to = window.setTimeout(() => location.reload(), 1000)
  }
})()

const App: FC = () => {
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') {
    //   return
    // }
    priHttp.fetch<ReactAppExt>('moodlenet.react-app', '0.1.10')('webapp/updated')().finally(reloadWebapp)
  }, [])
  return (
    <BrowserRouter>
      <ProvideMainContexts>
        <AppRoutes />
      </ProvideMainContexts>
    </BrowserRouter>
  )
}

export default App
