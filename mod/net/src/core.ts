import { core_factory } from '@moodle/domain'

export function core(): core_factory {
  return ({ worker }) => {
    const mySec = worker.moodle.net.v0_1.sec
    return {
      moodle: {
        net: {
          v0_1: {
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
