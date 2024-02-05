import type { FC } from 'react'
import './VisualResourceAlert.scss'

export const VisualResourceAlert: FC = () => {
  return (
    <div className={`visual-resource-alert`}>
      <div className="red-dot" />
    </div>
  )
}

VisualResourceAlert.defaultProps = {}

export default VisualResourceAlert
