'use client'
import { slots } from '@/lib-ui/utils/types'
import './MainHeader.scss'

export interface MainHeaderProps {
  slots: slots<'center' | 'left' | 'right'>
}

export default function MainHeader({ slots: { center, left, right } }: MainHeaderProps) {
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
