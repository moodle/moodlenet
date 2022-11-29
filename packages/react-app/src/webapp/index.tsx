import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'

const elem = document.getElementById('root')
if (!elem) throw 'react cant start, root id elem not found '

const root = ReactDOM.createRoot(elem)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
