import type { PropsWithChildren, ReactNode } from 'react'
import './layout.main.scss'

export default async function LayoutMain({
  children,
  header,
  footer,
}: PropsWithChildren<{ header: ReactNode; footer: ReactNode }>) {
  return (
    <div className={`main-layout`}>
      {header}
      <div className="content">{children}</div>
      {footer}
    </div>
  )
}
