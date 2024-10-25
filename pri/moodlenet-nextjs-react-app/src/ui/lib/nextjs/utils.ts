import { useEffect, useState } from 'react'

// import { AddonItem } from '../types'
export function useInBrowser() {
  const [inBrowser, setInBrowser] = useState(false)
  useEffect(() => {
    setInBrowser(true)
  }, [])
  return inBrowser
}
