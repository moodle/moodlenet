import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
import AppRouter from './router'

lib
  .getExposed('moodlenet-pri-http')
  .sub(
    'moodlenet-core',
    '0.1.10',
  )('ext/listDeployed')()
  .subscribe((callFromApp: any) => console.log({ callFromApp }))

const App: FC = () => {
  return <AppRouter />
}

export default App
