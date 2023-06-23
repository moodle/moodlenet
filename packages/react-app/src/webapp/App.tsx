import type { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app-routes.js'
import { ProvideLinkComponentCtx, ProvideViewport } from './exports/ui.mjs'
import { MainApp } from './MainApp.js'
import { MainSearchBoxCtxProviderContainer } from './ui/components/atoms/MainSearchBox/MainSearchBoxProviderContainer.js'

const App: FC = () => {
  return (
    <ProvideViewport>
      <BrowserRouter>
        <ProvideLinkComponentCtx>
          <MainSearchBoxCtxProviderContainer>
            <MainApp>
              <AppRoutes />
            </MainApp>
          </MainSearchBoxCtxProviderContainer>
        </ProvideLinkComponentCtx>
      </BrowserRouter>
    </ProvideViewport>
  )
}

export default App
