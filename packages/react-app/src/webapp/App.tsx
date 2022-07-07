import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app-routes'
import { ProvideMainContexts } from './mainContextProviders'

const App: FC = () => {
  return (
    <BrowserRouter>
      <ProvideMainContexts>
        <AppRoutes />
      </ProvideMainContexts>
    </BrowserRouter>
  )
}

export default App
