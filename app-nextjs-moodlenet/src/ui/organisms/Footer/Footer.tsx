'use client'
import { slots } from '@/lib/ui/utils/types'
import './Footer.scss'

export interface FooterProps {
  slots: slots<'center' | 'left' | 'right' | 'bottom'>
}

export default function Footer({ slots: { bottom, center, left, right } }: FooterProps) {
  return (
    <div className="footer">
      <div className="top">
        <div className="left">{left}</div>
        <div className="center">{center}</div>
        <div className="right">{right}</div>
      </div>
      <div className="bottom">
        <div className="bottom">{bottom}</div>
      </div>
    </div>
  )
}
