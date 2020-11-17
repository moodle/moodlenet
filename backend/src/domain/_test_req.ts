import { consumeWf, publishWfStart } from '../lib/domain3/amqp'
import { point } from '../lib/domain3/domain'
import { MoodleNetDomain } from './MoodleNetDomain'
const __LOG = true
const l = (...args: any[]) =>
  __LOG &&
  console.log('APP----------\n', ...args.reduce((r, _) => [...r, _, '\n'], []), '----------\n\n')

const acc = point<MoodleNetDomain>('MoodleNet')('srv')('Accounting')
export const accReg = acc('wf')('RegisterNewAccount')
Array(1000)
  .fill(1)
  .map(async (_, index) => {
    // const id = newUuid()
    // l(id)
    // console.log(index)
    const x = await consumeWf({
      pointer: accReg('end')('*'),
      id: '*',
      handler: (_) => {
        // l(
        //   `*** *********************************************************************RESP ${index}zz`,
        //   info,
        //   payload
        // )
        console.log(_, index)
        // x.then((_) => _())
        return 'ack'
      },
    })
    publishWfStart({
      pointer: accReg('start'),
      payload: {
        email: `${index}zz`,
        username: 'ww',
      },
    })
  })
