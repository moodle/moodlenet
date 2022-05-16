import { CSSProperties, FC, ReactNode, useEffect, useState } from 'react'
import './styles.scss'

// REFERENCE FOR REFACTOR https://codesandbox.io/s/useerrorclass-qpgdn?file=/src/ErrorCtx.tsx:215-223

export type ErrorWrapperProps = {
  error: ReactNode
  className?: string
  style?: CSSProperties
  hideBorderWhenSmall?: boolean
  disabled?: boolean
}

export const ErrorWrapper: FC<ErrorWrapperProps> = ({
  error,
  className,
  disabled,
  style,
  children,
}) => {
  const [errorLeaves, setErrorLeaves] = useState<boolean>(false)
  const [currentError, setcurrentError] = useState<ReactNode>(undefined)

  useEffect(() => {
    if (error) {
      setErrorLeaves(false)
      setcurrentError(error)
    } else {
      if (currentError) {
        setErrorLeaves(true)
        setTimeout(() => {
          setcurrentError(undefined)
        }, 500)
      } else {
        setcurrentError(undefined)
      }
    }
  }, [error, setErrorLeaves, currentError])

  return (
    <div
      className={`error-wrapper ${className}${disabled ? ' disabled' : ''} ${
        error ? ' highlight' : ''
      } ${!errorLeaves && error ? 'enter-error' : ''} ${
        errorLeaves ? 'leave-error' : ''
      }`}
      style={style}
    >
      {children}
      <div className="error-msg">{error}</div>
    </div>
  )
}

ErrorWrapper.defaultProps = {}

export default ErrorWrapper
