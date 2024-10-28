import type { Layouts, webappGlobalCtx } from './types'
export * from './types'

export default interface MoodlenetReactAppDomain {
  event: { moodlenetReactApp: unknown }
  service: { moodlenetReactApp: unknown }
  primary: {
    moodlenetReactApp: {
      session: {
        layouts(): Promise<Layouts>
        getWebappGlobalCtx(): Promise<webappGlobalCtx>
      }
    }
  }
  secondary: {
    moodlenetReactApp: {
      query?: unknown
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
