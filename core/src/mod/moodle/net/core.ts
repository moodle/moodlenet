import { factory } from '../../../types'

export function core(): factory<'pri'> {
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
