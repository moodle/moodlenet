import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

const ViewportCtx = createContext<Viewport>(getViewpoprt())

type Viewport = {
  width: number
  height: number
  screen: {
    type: 'big' | 'medium' | 'small'
    big: boolean
    medium: boolean
    small: boolean
  }
}
export const ProvideViewport: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return <ViewportCtx.Provider value={useViewportValue()}>{children}</ViewportCtx.Provider>
}

export function useViewport() {
  return useContext(ViewportCtx)
}

function useViewportValue(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(getViewpoprt)
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
    function handleWindowResize() {
      setViewport(getViewpoprt())
    }
  }, [])
  return viewport
}

function getViewpoprt(): Viewport {
  const type = window.matchMedia('screen and (min-width: 800px)').matches
    ? 'big'
    : window.matchMedia('(min-width: 450px) and (max-width: 800px)').matches
    ? 'medium'
    : window.matchMedia('screen and (max-width: 450px)').matches
    ? 'small'
    : 'medium'
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    screen: {
      type,
      big: type === 'big',
      medium: type === 'medium',
      small: type === 'small',
    },
  }
}
