import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { router } from '@/routes'
import '@/styles/globals.css'

const queryClient = new QueryClient()

const antdTheme = {
  token: {
    colorPrimary: '#3b5fd4',
    colorSuccess: '#4ade80',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif",
    colorBgContainer: 'rgba(255,255,255,0.04)',
    colorBgElevated: '#1a1d27',
    colorText: '#f0f0f5',
    colorTextSecondary: '#9090a8',
    colorBorder: '#2e3040',
    colorSplit: '#2e3040',
  },
  components: {
    Table: {
      headerBg: 'rgba(255,255,255,0.05)',
      rowHoverBg: 'rgba(255,255,255,0.04)',
      borderColor: '#2e3040',
    },
    Modal: {
      contentBg: '#16192a',
      headerBg: '#16192a',
    },
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={antdTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>
)
