import { core_factory } from '@moodle/domain'

export function core(): core_factory {
  return ({ worker }) => {
    const mySec = worker.moodle.net.v1_0.sec
    return {
      moodle: {
        net: {
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
