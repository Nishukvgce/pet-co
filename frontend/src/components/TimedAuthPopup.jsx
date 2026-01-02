import React, { useEffect, useState } from 'react'
import LoginModal from './ui/LoginModal'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'

const TimedAuthPopup = () => {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    // Don't show for logged-in users
    if (user) return

    // Don't show while already on auth pages
    if (pathname && (pathname.includes('/user-login') || pathname.includes('/user-register'))) {
      setVisible(false)
      return
    }

    // Show once on page load (so it appears on each full refresh for unauthenticated users)
    setVisible(true)

    // No interval: user asked popup only on refresh
    return () => {}
  }, [user, pathname])

  if (user) return null

  return visible ? <LoginModal onClose={() => setVisible(false)} /> : null
}

export default TimedAuthPopup
