import * as QM from './lib'

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
    return transport.send(actionExtract.id, actionExtract.args, waitsForResponse) as Promise<Res>
  }
  const callSync = async <Res>(action: QM.QMAction<any, Res>, waitsForResponse: QM.WaitsForResponse) => {
    const actionExtract = QM.extractAction(transport, action)
    if (actionExtract.type !== 'command') {
      throw new Error(`cannot callSync an action [${actionExtract.id}] of type ${actionExtract.type}`)
    }
    return transport.send(actionExtract.id, actionExtract.args, waitsForResponse) as Promise<Res>
  }

  return {
    open,
    callSync,
    query,
  }
}

export * from './types'
export const TIMEOUT = QM.TIMEOUT
export const QMCommand = QM.QMCommand
export const QMQuery = QM.QMQuery
export const QMModule = QM.QMModule
