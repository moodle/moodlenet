import { inspect } from 'util'
import { QMPortId, Transport } from '../../types'

const STDIN_TAG = 'qmino:'
export async function processBuffer(send: Transport['send'], buff: Buffer) {
  const str_in = buff.toString().trim()
  if (!str_in.startsWith(STDIN_TAG)) {
    return
  }
  const [id_str, ...rest] = str_in.replace(STDIN_TAG, '').trim().split('##')
  if (!id_str) {
    return
  }
  console.log({ id_str })
  const args_str = rest.join('##')
  console.log({ args_str })
  try {
    const args = args_str ? JSON.parse(args_str) : []
    console.log('Args:\n', inspect(args))
    console.log('sending...')

    const resp = await send(id_str.split('::') as QMPortId, args, { timeout: 5000 })
    console.log('RESP:\n', inspect(resp))
    return resp
  } catch (err) {
    console.error('ERR:\n', inspect(err))
    throw err
  }
}
