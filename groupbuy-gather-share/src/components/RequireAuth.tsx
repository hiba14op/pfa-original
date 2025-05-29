// src/components/RequireAuth.tsx
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface Props {
  children: ReactNode
  role: string
}

export default function RequireAuth({ children, role }: Props) {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  const location = useLocation()

  if (!token) {
    // pas connecté → redirige vers login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (userRole !== role) {
    // mauvais rôle → page “interdite” ou home
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

