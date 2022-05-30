import { FC } from 'react'
import { hot } from 'react-hot-loader'
import './http-services/test_sub'
import AppRouter from './routes'

const App: FC = () => {
  return <AppRouter />
}

export default hot(module)(App)
