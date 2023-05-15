import type { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app-routes.js'
import { ProvideLinkComponentCtx } from './exports/ui.mjs'
import { MainApp } from './MainApp.js'

const App: FC = () => {
  return (
    <BrowserRouter>
      <ProvideLinkComponentCtx>
        <MainApp>
          <AppRoutes />
        </MainApp>
      </ProvideLinkComponentCtx>
    </BrowserRouter>
  )
}

export default App
