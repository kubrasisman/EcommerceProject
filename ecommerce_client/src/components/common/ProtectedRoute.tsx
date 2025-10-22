import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/store'
import Loader from './Loader'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { accessToken, loading } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // If still loading auth state
  if (loading === 'loading') {
    return <Loader fullScreen text="Yükleniyor..." />
  }

  // If route requires auth and user is not authenticated
  if (requireAuth && !accessToken) {
    // Redirect to login, but save the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // If route requires NO auth (like login/register) and user IS authenticated
  if (!requireAuth && accessToken) {
    // Redirect to home page
    return <Navigate to="/" replace />
  }

  // User is authenticated or route doesn't require auth
  return <>{children}</>
}

