import React from 'react'
import ReactDOM from 'react-dom/client'
import { initializePlugins } from './plugin-initializer.mjs'

initializePlugins().then(async () => {
  const { default: App } = await import('./App.js')

  const elem = document.getElementById('root')
  if (!elem) throw 'react cant start, root id elem not found '

  const root = ReactDOM.createRoot(elem)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
