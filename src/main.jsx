import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, App as AntApp } from 'antd'
import { Toaster } from 'react-hot-toast'
import './index.css'
import router from './Routes/Routes.jsx'
import { store } from './Redux/store.js'
import { antdTheme } from './theme.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <AntApp>
          <RouterProvider router={router} />
        </AntApp>
      </ConfigProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: 12,
            fontSize: 14,
            padding: '10px 14px',
            boxShadow: '0 12px 32px -12px rgba(15,23,42,0.25)',
          },
          success: { iconTheme: { primary: '#016A70', secondary: '#fff' } },
        }}
      />
    </Provider>
  </StrictMode>
)
