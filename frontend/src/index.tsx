import 'regenerator-runtime/runtime'
import './index.css'

import { HashRouter, Route, Routes } from 'react-router-dom'

import { AppStateProvider } from './state/AppProvider'
import Chat from './pages/chat/Chat'
import Layout from './pages/layout/Layout'
import NoPage from './pages/NoPage'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { initializeIcons } from '@fluentui/react'

initializeIcons('https://res.cdn.office.net/files/fabric-cdn-prod_20241209.001/assets/icons/')

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Chat />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStateProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
