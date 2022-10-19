import { FC, ReactNode } from 'react'
import './Wrapper.scss'

export const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="wrapper">{children}</div>
}

export default Wrapper
