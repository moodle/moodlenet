import * as QM from './lib'
import { QMPortId } from './types'

export const Qmino = (transport: QM.Transport): QM.QMino => {
  const open: QM.QMino['open'] = async (port, adapter, teardown) => {
    return QM.open(port, adapter, transport, teardown)
  }
  const query: QM.QMino['query'] = async <Res>(
    action: QM.QMAction<any, Res>,
    waitsForResponse: QM.WaitsForResponse,
  ) => {
    const actionExtract = QM.extractAction(transport, action)
    if (actionExtract.type !== 'query') {
      throw new Error(`cannot query an action [${actionExtract.id}] of type ${actionExtract.type}`)
    }
    const { args, id } = actionExtract
    const resp = transport.send(id, args, waitsForResponse)
    return portLogUmbrella(resp, { args, id })
  }
  const callSync = async <Res>(action: QM.QMAction<any, Res>, waitsForResponse: QM.WaitsForResponse) => {
    const actionExtract = QM.extractAction(transport, action)
    if (actionExtract.type !== 'command') {
      throw new Error(`cannot callSync an action [${actionExtract.id}] of type ${actionExtract.type}`)
    }
    const { args, id } = actionExtract
    const resp = transport.send(id, args, waitsForResponse)
    return portLogUmbrella(resp, { args, id })
  }

  return {
    open,
    callSync,
    query,
  }
}

export const TIMEOUT = QM.TIMEOUT
export const QMCommand = QM.QMCommand
export const QMQuery = QM.QMQuery
export const QMModule = QM.QMModule
export * from './types'

async function portLogUmbrella<T>(p: Promise<T>, { args, id }: { id: QMPortId; args: any[] }): Promise<T> {
  const logmsg = `
- QMino port access -
  portId : ${id.join('::')} 
  args : ${JSON.stringify(args, null, 2)}
  `
  try {
    const res = await p
    console.log(`${logmsg}response : ${JSON.stringify(res, null, 2)}}`, res)
    return res
  } catch (e) {
    console.error(`${logmsg}error : ${String(e)} - ${e instanceof Error ? e.stack : ''}`, e)
    throw e
  }
}
