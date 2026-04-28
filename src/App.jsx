import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ConfigProvider, theme as antdThemeEngine, App as AntdApp } from 'antd'
import { router } from '@/routes'
import { useTheme } from '@/context/ThemeContext'

const queryClient = new QueryClient()

const App = () => {
  const { theme } = useTheme();
  
  const antdTheme = {
    algorithm: theme === 'dark' ? antdThemeEngine.darkAlgorithm : antdThemeEngine.defaultAlgorithm,
    token: {
      colorPrimary: '#3b5fd4',
      colorSuccess: '#4ade80',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      borderRadius: 8,
      fontFamily: "'DM Sans', sans-serif",
      colorBgContainer: theme === 'dark' ? 'rgba(255,255,255,0.04)' : '#ffffff',
      colorBgElevated: theme === 'dark' ? '#1a1d27' : '#ffffff',
      colorText: theme === 'dark' ? '#f0f0f5' : '#1f2937',
      colorTextSecondary: theme === 'dark' ? '#9090a8' : '#6b7280',
      colorBorder: theme === 'dark' ? '#2e3040' : '#e5e7eb',
      colorSplit: theme === 'dark' ? '#2e3040' : '#e5e7eb',
    },
    components: {
      Table: {
        headerBg: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f9fafb',
        rowHoverBg: theme === 'dark' ? 'rgba(255,255,255,0.04)' : '#f3f4f6',
        borderColor: theme === 'dark' ? '#2e3040' : '#e5e7eb',
      },
      Modal: {
        contentBg: theme === 'dark' ? '#16192a' : '#ffffff',
        headerBg: theme === 'dark' ? '#16192a' : '#ffffff',
      },
    }
  }

  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App;
