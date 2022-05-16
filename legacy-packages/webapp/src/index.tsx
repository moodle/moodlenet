import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { GlobalContexts } from './context/Global'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { MNRouter } from './routes/MNRouter'

ReactDOM.render(
  <StrictMode>
    <GlobalContexts>
      <MNRouter />
    </GlobalContexts>
  </StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
navigator?.serviceWorker?.register('/service-worker.js')
