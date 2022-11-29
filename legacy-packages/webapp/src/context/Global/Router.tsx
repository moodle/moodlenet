import { History } from 'history'
import { FC, useEffect } from 'react'
import { BrowserRouter, useHistory } from 'react-router-dom'

export const RouterProvider: FC = ({ children }) => {
  return (
    <BrowserRouter>
      <PreventPushSameLocation>{children}</PreventPushSameLocation>
    </BrowserRouter>
  )
}

// hack to prevent multiple history Push to Same Location
// https://github.com/ReactTraining/react-router/issues/5362#issuecomment-552174266
let done = false
let currentLocation = window.location.pathname + window.location.search
const preventPushSameLocation: History.TransitionPromptHook = (
  location,
  action
) => {
  const nextLocation = location.pathname + location.search
  if (action === 'PUSH') {
    if (currentLocation === nextLocation) {
      return false
    }
  }

  currentLocation = nextLocation
  return
}
const PreventPushSameLocation: FC = ({ children }) => {
  const history = useHistory()
  useEffect(() => {
    done || history.block(preventPushSameLocation)
  }, [history])
  return <>{children}</>
}
