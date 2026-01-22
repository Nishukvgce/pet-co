import React, { useEffect, useState } from 'react'
import LoginModal from './ui/LoginModal'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'

const TimedAuthPopup = () => {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)
  const { pathname } = useLocation()

  const POPUP_INTERVAL = 3600000 // 1 hour in milliseconds
  const LAST_POPUP_KEY = 'lastAuthPopupTime'

  const shouldShowPopup = () => {
    const lastPopupTime = localStorage.getItem(LAST_POPUP_KEY)
    const now = Date.now()
    
    // If no previous popup time, or it's been more than an hour
    if (!lastPopupTime || (now - parseInt(lastPopupTime)) >= POPUP_INTERVAL) {
      return true
    }
    return false
  }

  const markPopupShown = () => {
    localStorage.setItem(LAST_POPUP_KEY, Date.now().toString())
  }

  useEffect(() => {
    // Don't show for logged-in users
    if (user) {
      setVisible(false)
      return
    }

    // Don't show in admin panel anywhere
    if (pathname && pathname.includes('/admin')) {
      setVisible(false)
      return
    }

    // Don't show while already on auth pages
    if (pathname && (pathname.includes('/user-login') || pathname.includes('/user-register'))) {
      setVisible(false)
      return
    }

    // Only show if enough time has passed
    if (shouldShowPopup()) {
      setVisible(true)
      markPopupShown()
    }

    // Set up interval to check every minute if we should show popup
    const checkInterval = setInterval(() => {
      if (!user && pathname && !pathname.includes('/admin') && !pathname.includes('/user-login') && !pathname.includes('/user-register')) {
        if (shouldShowPopup()) {
          setVisible(true)
          markPopupShown()
        }
      }
    }, 60000) // Check every minute

    return () => {
      clearInterval(checkInterval)
    }
  }, [user, pathname])

  // Handle popup close
  const handleClose = () => {
    setVisible(false)
    // Don't update the timestamp when manually closed, 
    // so it can still appear again at the proper hour interval
  }

  // Never show if user is logged in or on admin pages
  if (user || (pathname && pathname.includes('/admin'))) return null

  return visible ? <LoginModal onClose={handleClose} /> : null
}

export default TimedAuthPopup
