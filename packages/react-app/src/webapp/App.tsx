import { FC, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ReactAppExt } from '..'
import priHttp from '../react-app-lib/pri-http'
import AppRoutes from './app-routes'
import { ProvideMainContexts } from './mainContextProviders'

const App: FC = () => {
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') {
    //   return
    // }
    priHttp
      .fetch<ReactAppExt>(
        'moodlenet.react-app',
        '0.1.10',
      )('webapp/updated')()
      .then(() => {
        alert('webapp updated, will refresh')
        location.reload()
      })
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
