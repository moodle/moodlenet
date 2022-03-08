import { FC } from 'react'
import './styles.scss'

export type FileUploaderProps = {
  onClick?(arg0: unknown): unknown | any
  className?: string
  disabled?: boolean
  color?: '' | 'green' | 'red' | 'grey' | 'blue'
  onHoverColor?: '' | 'green' | 'orange' | 'red' | 'green'
}

export const FileUploader: FC<FileUploaderProps> = ({
  children,
  className,
  color,
  onHoverColor,
  disabled,
  onClick,
}) => {
  return (
    <div
      className={`file-uploader button ${className} ${onHoverColor} ${
        disabled ? 'disabled' : ''
      } ${color}`}
      tabIndex={!disabled ? 0 : undefined}
      onClick={!disabled ? onClick : () => {}}
    >
      {children}
    </div>
  )
}

FileUploader.defaultProps = {
  color: '',
  onHoverColor: '',
}

export default FileUploader
