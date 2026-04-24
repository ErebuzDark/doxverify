import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import VerifyPage from '@/pages/VerifyPage'
import AdminPage from '@/pages/AdminPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/verify/:code', element: <VerifyPage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '*', element: <HomePage /> },
])
