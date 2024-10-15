import type { Layouts } from './types'
export * from './types'

export default interface NetWebappNextjsDomain {
  event: { netWebappNextjs: unknown }
  primary: {
    netWebappNextjs: {
      webapp: {
        layouts(): Promise<Layouts>
      }
    }
  }
  secondary: {
    netWebappNextjs: {
      queue: unknown
      query: unknown
      service: unknown
      write: unknown
      sync: unknown
    }
  }
}
