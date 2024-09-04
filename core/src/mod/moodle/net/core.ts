import { core_factory } from '../../../types'

export function core(): core_factory {
  return ({ worker }) => {
    const mysec = worker.moodle.net.V0_1.sec
    return {
      moodle: {
        net: {
          V0_1: {
            pri: {
              read: {
                async configs() {
                  return mysec.read.configs()
                },
              },
            },
          },
        },
      },
    }
  }
}
