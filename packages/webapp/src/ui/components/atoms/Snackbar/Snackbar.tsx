import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import React, { useCallback } from 'react'
import Card from '../Card/Card'
import './styles.scss'

export type SnackbarProps = {
  title?: string
  actions?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  onClose: () => void
}

const stopPropagation = (event: React.MouseEvent) => event.stopPropagation()

export const Snackbar: React.FC<SnackbarProps> = ({ onClose, title, actions, style, className, children }) => {
  const handleonClose = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      onClose()
    },
    [onClose],
  )

  return (
    <Card className={`snackbar ${className}`} onClick={stopPropagation} style={style}>
      {actions && <div className="actions">{actions}</div>}
      <div className="title">{title}</div>
      <div className="content">{children}</div>
      <div className="close-button" onClick={handleonClose}>
        <CloseRoundedIcon />
      </div>
    </Card>
  )
}
Snackbar.defaultProps = {
  className: '',
}

export default Snackbar
