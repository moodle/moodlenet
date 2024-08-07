import type { PropsWithChildren, ReactNode } from 'react'
import './MainLayout.scss'

export default async function MainLayout({
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
