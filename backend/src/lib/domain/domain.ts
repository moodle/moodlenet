import { Message } from 'amqplib'

export type WfLifeMsgRoutingInfo = ReturnType<typeof wfLifeMsgRoutingInfo>
export const wfLifeMsgRoutingInfo = (msg: Message) => {
  const [domain, , service, , wfname, action, type, id] = msg.fields.routingKey.split('.')
  return { domain, service, wfname, action, type, id }
}

export type WfStartMsgRoutingInfo = ReturnType<typeof wfStartMsgRoutingInfo>
export const wfStartMsgRoutingInfo = (msg: Message) => {
  const [domain, , service, , wfname, , id] = msg.fields.routingKey.split('.')
  return { domain, service, wfname, id }
}

export type EventMsgRoutingInfo = ReturnType<typeof eventMsgRoutingInfo>
export const eventMsgRoutingInfo = (msg: Message) => {
  const [domain, , service, , evName] = msg.fields.routingKey.split('.')
  return { domain, service, evName }
}

export type WfStartPointerInfo = ReturnType<typeof wfStartPointerInfo>
export const wfStartPointerInfo = (point: Pointer<PathTo.WFStart, any, any, any, any>) => {
  const [domain, , service, , wfname] = point.path
  return { domain, service, wfname }
}
