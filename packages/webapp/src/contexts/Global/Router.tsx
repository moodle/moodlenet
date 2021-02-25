import { History } from 'history'
import { FC, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, useHistory, useLocation } from 'react-router-dom'

//TODO : move those hooks into nav.ts
export const useGlobalSearchText = () => {
  const urlQuery = useUrlQuery()
  const qs = useMemo(() => urlQuery.get('q') ?? '', [urlQuery])
  const _state = useState(qs)
  const [, setSearchText] = _state
  useEffect(() => setSearchText(qs), [qs, setSearchText])
  return _state
}
export const useUrlQuery = () => new URLSearchParams(useLocation().search)

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
const preventPushSameLocation: History.TransitionPromptHook = (location, action) => {
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
