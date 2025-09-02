import { useEffect, useState } from 'react'

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (window.google) {
      setIsLoaded(true)
      return
    }

    // Check if script is already added
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true))
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    // script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAQum4SDxPbmzRQd5wzuPZdz-TD6pnW88k`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Cleanup if needed
    }
  }, [])

  return { isLoaded }
}