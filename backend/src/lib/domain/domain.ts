import { Message } from 'amqplib'
// import { Domain } from './types'

// export const domain=<Dom extends Domain>(dom:Domain.Name<Dom>)=>({
//   srv:<Srv extends keyof Dom['srv']>(srv:Srv)=>({
//     wf:<Srv extends keyof Dom['srv'][Srv]['wf']>(wf:Wf)=>({

//     })
//   })
// })

export type WfLifeMsgInfo = ReturnType<typeof wfLifeMsgInfo>
export const wfLifeMsgInfo = (msg: Message) => {
  const [domain, , service, , wfname, action, type, id] = msg.fields.routingKey.split('.')
  return { domain, service, wfname, action, type, id }
}

export type WfStartMsgInfo = ReturnType<typeof wfStartMsgInfo>
export const wfStartMsgInfo = (msg: Message) => {
  const [domain, , service, , wfname, , id] = msg.fields.routingKey.split('.')
  return { domain, service, wfname, id }
}

export type EventMsgInfo = ReturnType<typeof eventMsgInfo>
export const eventMsgInfo = (msg: Message) => {
  const [domain, , service, , evName] = msg.fields.routingKey.split('.')
  return { domain, service, evName }
}
