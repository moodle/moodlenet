import { core_factory } from '@moodle/lib-ddd'

export function core(): core_factory {
  return ({ worker }) => {
    const mySec = worker.moodle.netWebappNextjs.v1_0.sec
    return {
      moodle: {
        netWebappNextjs: {
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
