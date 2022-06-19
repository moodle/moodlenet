import { ExtId } from '@moodlenet/core'
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ContainerContextsProviders, reactAppContainer } from './container-contexts-providers'
import extensions from './extensions'

const extensionInstances: Record<ExtId, any> = {}
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    {/* <I18nProvider i18n={i18n}> */}
    <ContainerContextsProviders extensionInstances={extensionInstances}>
      {extensions.reduce<ReactNode>((aggreagateChild, { extId, main }) => {
        const { instance, Comp } = main({ reactAppContainer })
        if (extensionInstances[extId]) {
          console.error({ extId, main })
          throw new Error(`shouldn't happen, ${extId} already present in extensionInstances record`)
        }
        extensionInstances[extId] = instance
        return Comp && <Comp key={extId}>{aggreagateChild}</Comp>
      }, <App />)}
    </ContainerContextsProviders>
    {/* </I18nProvider> */}
  </React.StrictMode>,
)
