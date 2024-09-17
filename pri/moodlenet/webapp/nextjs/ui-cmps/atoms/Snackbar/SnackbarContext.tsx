'use client'
import type { ReactElement, ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useState } from 'react'
import type { SnackbarProps } from './Snackbar'
import Snackbar from './Snackbar'
import SnackbarStack from './SnackbarStack'

interface SnackbarContextType {
  addSnackbar: (snackbar: SnackbarProps | ReactElement) => void
  removeSnackbar: (snackbarId: string) => void
  snackbars: ReactElement[]
}

export const SnackbarContext = createContext<SnackbarContextType>({
  addSnackbar: () => {
    // Provide empty function as default
  },
  removeSnackbar: () => {
    // Provide empty function as default
  },
  snackbars: [], // Default empty array
})

export const useSnackbar = () => useContext(SnackbarContext)

interface SnackbarProviderProps {
  children: ReactNode
}

// Type guard function to check if an object is SnackbarProps
const isSnackbarProps = (object: unknown): object is SnackbarProps => {
  // First, ensure the object is actually an object
  if (typeof object !== 'object' || object === null) return false

  // Then, check for the existence and type of mandatory properties
  const props = object as SnackbarProps // Type cast to access properties

  // Check mandatory properties
  if (typeof props.children === 'undefined') return false

  // Check optional string properties
  const typeIsValid =
    typeof props.type === 'undefined' ||
    ['success', 'info', 'warning', 'error'].includes(props.type)
  const positionIsValid =
    typeof props.position === 'undefined' || ['top', 'bottom'].includes(props.position)

  return typeIsValid && positionIsValid
}

export const SnackbarCtxProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<ReactElement<SnackbarProps>[]>([])

  const topSnackbars = snackbars.filter(
    (snackbar): snackbar is ReactElement<SnackbarProps> =>
      React.isValidElement(snackbar) && snackbar.props.position === 'top',
  )

  const bottomSnackbars = snackbars.filter(
    (snackbar): snackbar is ReactElement<SnackbarProps> =>
      React.isValidElement(snackbar) && snackbar.props.position === 'bottom',
  )

  const addSnackbar = useCallback((snackbar: SnackbarProps | ReactElement) => {
    let newSnackbar: ReactElement
    const key = Date.now().toString()

    if (React.isValidElement(snackbar)) {
      // If it's already a ReactElement, clone it with a new key.
      newSnackbar = React.cloneElement(snackbar, { key: snackbar.key || key })
    } else if (isSnackbarProps(snackbar)) {
      // If it's an object of SnackbarProps, create a Snackbar element.
      newSnackbar = <Snackbar key={key} {...snackbar} />
    } else {
      return // Invalid snackbar object provided
    }

    setSnackbars([newSnackbar])
  }, [])

  const removeSnackbar = useCallback((snackbarId: string) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.key !== snackbarId))
  }, [])

  return (
    <SnackbarContext.Provider value={{ addSnackbar, removeSnackbar, snackbars }}>
      <SnackbarStack snackbarList={topSnackbars} position="top" />
      <SnackbarStack snackbarList={bottomSnackbars} position="bottom" />
      {children}
    </SnackbarContext.Provider>
  )
}

export default SnackbarCtxProvider
