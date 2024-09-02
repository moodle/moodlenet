import { factory } from 'domain/src/types'

export function core(): factory<'pri'> {
  return ({ worker }) => {
    const mysec = worker.moodle.net.V0_1.sec
    return {
      moodle: {
        net: {
          V0_1: {
            pri: {
              website: {
                async info() {
                  return mysec.website.info()
                },
                async layouts() {
                  return mysec.website.layouts()
                },
              },
            },
          },
        },
      },
    }
  }
}
