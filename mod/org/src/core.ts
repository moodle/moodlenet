import { core_factory } from '@moodle/lib-ddd'

export * as v1_0 from './v1_0/types'

export function core(): core_factory {
  return ({ worker }) => {
    const mySec = worker.moodle.org.v1_0.sec
    return {
      moodle: {
        org: {
          v1_0: {
            pri: {
              configs: {
                async read() {
                  return mySec.db.getConfigs()
                },
              },
            },
          },
        },
      },
    }
  }
}
