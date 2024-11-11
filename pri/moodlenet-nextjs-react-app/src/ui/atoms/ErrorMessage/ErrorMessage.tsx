'use client'
import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import './ErrorMessage.scss'

export type ErrorMessageProps = {
  error: ReactNode
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
  const [errorLeave, setErrorLeave] = useState<boolean>(false)
  const [currentError, setcurrentError] = useState<ReactNode>(undefined)

  useEffect(() => {
    if (error) {
      setErrorLeave(false)
      setcurrentError(error)
    } else {
      if (currentError) {
        setErrorLeave(true)
        setTimeout(() => {
          setcurrentError(undefined)
        }, 500)
      } else {
        setcurrentError(undefined)
      }
    }
  }, [error, setErrorLeave, currentError])

  return (
    <div
      className={`error ${!errorLeave && error ? 'enter-error' : ''} ${
        errorLeave ? 'leave-error' : ''
      }`}
    >
      {currentError && <div className={`error-msg`}>{currentError}</div>}
    </div>
  )
}

ErrorMessage.displayName = 'ErrorMessage'
export default ErrorMessage
