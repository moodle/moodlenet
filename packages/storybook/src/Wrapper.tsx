
import { FC, ReactNode } from 'react'
import './styles.scss'


export const Wrapper: FC<{children: ReactNode}> = ({
children
}) => {
  return (
    <div
      className='wrapper'
    >
      {children}
    </div>
  )
}


export default Wrapper
