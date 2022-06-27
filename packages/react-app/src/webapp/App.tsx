import { FC } from 'react'
import { ProvideMainContexts } from './mainContextProviders'
import AppRouter from './router'

const App: FC = () => {
  return (
    <ProvideMainContexts>
      <AppRouter />
    </ProvideMainContexts>
  )
}

export default App
