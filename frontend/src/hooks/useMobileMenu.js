import { useState } from 'react'

export const useMobileMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const openMobileMenu = () => setIsMobileMenuOpen(true)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return {
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu
  }
}