import 'antd/dist/antd.css'
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AppRouterContextProvider, RouterCtx } from './routes'

const extensions = require('../../extensions')
// fetch(`http::localhost:8888/_srv/_moodlenet_/pri-http/a/b`, {
//   body: JSON.stringify({ k: 1111, t: 'xx' }),
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
//   method: 'post',
// }).then(async r => console.log(await r.json()))

ReactDOM.render(
  <React.StrictMode>
    <AppRouterContextProvider>
      {Object.entries(extensions).reduce<ReactNode>((child, [pkgName, ExtensionCmp]) => {
        const C = ExtensionCmp as any
        return (
          <C key={pkgName} RouterCtx={RouterCtx}>
            {child}
          </C>
        )
      }, <App />)}
    </AppRouterContextProvider>
  </React.StrictMode>,
  document.querySelector('#root'),
)
