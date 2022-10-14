import { FC, PropsWithChildren } from 'react'

export const Ciccio: FC<PropsWithChildren> = ({ children }) => {
  return <div style={{ padding: '24px 24px 0 24px' }}>Ciccio: {children}</div>
}
