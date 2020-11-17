import { Message } from 'amqplib'
import { Concat } from 'typescript-tuple/lib/utils'
import { Domain, DomainName, PathTo, Pointer } from './types'

type Crawl<Point extends Pointer<PathTo.Any, any, any, string, any>> = (
  point: Point
) => Point['path'] extends PathTo.AnyLeaf
  ? Point
  : <
      Prop extends Concat<Point['path'], [Prop]> extends PathTo.AnyLeaf
        ? keyof Point['type'] | '*'
        : keyof Point['type']
    >(
      prop: Prop
    ) => ReturnType<
      Crawl<
        //@ts-expect-error
        Pointer<
          //@ts-expect-error
          Concat<Point['path'], [Prop extends '*' ? keyof Point['type'] : Prop]>,
          Point['type'][Prop extends '*' ? keyof Point['type'] : Prop],
          Point['type'],
          Prop,
          Point['domain']
        >
      >
    >

const _crawl = (point: Pointer<PathTo.Any, any, any, any, any>) => {
  // console.log('point', point, point.path.length, point.path[3], point.path[5])
  const more = (prop: string) => {
    return crawl({
      path: [...point.path, prop],
    } as any)
  }
  if (point.path.length < 5) {
    return more
  } else if (
    (point.path.length === 5 && point.path[3] === 'ev') ||
    (point.path.length === 6 && point.path[3] === 'wf' && point.path[5] === 'start') ||
    (point.path.length === 7 && point.path[3] === 'wf' && point.path[5] !== 'start')
  ) {
    return point
  } else return more
}
const crawl: Crawl<Pointer<PathTo.Any, any, any, any, any>> = _crawl as any

export const point = <Dom extends Domain>(
  domainName: DomainName<Dom>
): ReturnType<
  Crawl<
    Pointer<PathTo.P1<DomainName<Dom>>, Dom, { [k in DomainName<Dom>]: Dom }, DomainName<Dom>, Dom>
  >
> => {
  return crawl({
    path: [domainName],
  } as any) as any
}

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
