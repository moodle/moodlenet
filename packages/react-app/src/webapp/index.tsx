import 'antd/dist/antd.css'
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import extensions from './extensions'
import { AppRouterContextProvider, RouterCtx } from './routes'
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
      {Object.entries(extensions).reduce<ReactNode>((child, [pkgName, { /* extId, */ MainComponent }]) => {
        return (
          <MainComponent key={pkgName} RouterCtx={RouterCtx}>
            {child}
          </MainComponent>
        )
      }, <App />)}
    </AppRouterContextProvider>
  </React.StrictMode>,
  document.querySelector('#root'),
)
