import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { baseStyle } from '../../component-library/src/common/config.js'
import './Wrapper.scss'

export const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const styles = baseStyle()

  useEffect(() => {
    for (const [key, value] of Object.entries(styles)) {
      document.documentElement.style.setProperty(key, value)
    }
    return () => {
      for (const [key] of Object.entries(styles)) {
        document.documentElement.style.removeProperty(key)
      }
    }
  })

  return <div className="wrapper">{children}</div>
}

export default Wrapper
