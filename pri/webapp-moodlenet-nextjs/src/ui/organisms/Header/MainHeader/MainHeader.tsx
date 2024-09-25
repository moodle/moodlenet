'use client'
import { ReactNode } from 'react'
import './MainHeader.scss'

export interface MainHeaderProps {
  slots: Record<'center' | 'left' | 'right', ReactNode>
}

export function MainHeader({ slots: { center, left, right } }: MainHeaderProps) {
  return (
    <div className="header">
      <div className="content">
        <div className="left" key="left">
          {left}
        </div>
        <div className="center" key="center">
          {center}
        </div>
        <div className="right" key="right">
          {right}
        </div>
      </div>
    </div>
  )
}
