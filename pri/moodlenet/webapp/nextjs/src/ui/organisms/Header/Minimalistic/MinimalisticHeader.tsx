'use client'
import { ReactNode } from 'react'
import './MinimalisticHeader.scss'

export default function MinimalisticHeader({
  slots: { left, center, right },
}: {
  slots: Record<'left' | 'center' | 'right', ReactNode>
}) {
  return (
    <div className="minimalistic-header">
      <div className="content">
        <div className="left">{left}</div>
        <div className="center">{center}</div>
        <div className="right">{right}</div>
      </div>
    </div>
  )
}
