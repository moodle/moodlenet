'use client'
import { slots } from '@/lib/ui/utils/types'
import './MinimalisticHeader.scss'

export default function MinimalisticHeader({
  slots: { left, center, right },
}: {
  slots: slots<'left' | 'center' | 'right'>
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
