import { ReactAppExtMain } from '@moodlenet/react-app'
import { Context, createContext, FC, PropsWithChildren, useMemo } from 'react'
import { HttpAdapterCtx } from './types'
import { sub } from './xhr-adapter'
import './_test_sub'

const ext: ReactAppExtMain<{
  HttpAdapterCtx: Context<HttpAdapterCtx>
}> = (/* { reactAppContainer } */) => {
  const HttpAdapterCtx = createContext<HttpAdapterCtx>({ sub })

  const Comp: FC<PropsWithChildren<{}>> = ({ children }) => {
    const ctx = useMemo<HttpAdapterCtx>(() => {
      return {
        sub,
      }
    }, [])
    return <HttpAdapterCtx.Provider value={ctx}>{children}</HttpAdapterCtx.Provider>
  }

  return {
    Comp,
    instance: { HttpAdapterCtx },
  }
}
export default ext
