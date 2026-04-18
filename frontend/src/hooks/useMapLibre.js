import { useEffect, useState } from 'react'

export const useMapLibre = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (window.maplibregl) {
      setIsLoaded(true)
      return
    }

    const existingScript = document.querySelector('script[src*="maplibre-gl"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true))
      existingScript.addEventListener('error', () => {
        setError('Failed to load MapLibre script')
      })
      return
    }

    // Load MapLibre script and CSS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js'
    script.async = true
    script.onload = () => setIsLoaded(true)
    script.onerror = () => {
      setError('Failed to load MapLibre script')
      console.error('MapLibre script loading failed')
    }
    document.head.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css'
    document.head.appendChild(link)

    return () => {
      // Cleanup if needed
    }
  }, [])

  return { isLoaded, error }
}