import { Message } from 'amqplib'
import { newUuid } from '../helpers/misc'
import {
  Acks,
  assertQ,
  domainConsume,
  domainPublish,
  DomainPublishOpts,
  queueConsume,
  sendToQueue,
} from './amqp'
import { mainNodePersistence } from './domain.env'
import { DomainTopic } from './impl/persistence/types'
import { Consume, ForwardTopicMsg, Publish, ReplyError } from './types'

type DomainMsgHeaders = Partial<{ forwardedFrom: DomainTopic }>
const DomainMsgHeaderProp = `x-sys-domain-header`

const mkMsgHeader = (domainHeaders: DomainMsgHeaders) => ({ [DomainMsgHeaderProp]: domainHeaders })
const getMsgHeader = (msg: Message): DomainMsgHeaders =>
  msg.properties.headers[DomainMsgHeaderProp] || {}

export const domain = <Domain>(domain: string) => {
  const publish: Publish<Domain> = async ({ target, payload, replyCb, opts }) => {
    const pubOpts: DomainPublishOpts = { ...opts }

    const topic = fullTopic(target)
    mainNodePersistence
      .getForwards({
        src: { domain, topic },
      })
      .then((forwards) =>
        forwards.forEach((fwd) => {
          domainPublish({
            payload,
            domain: fwd.domain,
            topic: fwd.topic,
            opts: {
              headers: mkMsgHeader({ forwardedFrom: { domain, topic } }),
            },
          })
        })
      )

    if (replyCb) {
      const qName = newUuid()
      pubOpts.replyTo = qName
      assertQ({ name: qName, opts: { exclusive: true } })
      await queueConsume({
        qName,
        handler({ /*  msg, */ msgJsonContent, stop }) {
          replyCb({ payload: msgJsonContent, stop })
          return Acks.ack
        },
        opts: { exclusive: true },
      })
    }
    return domainPublish({
      domain,
      payload,
      topic,
      opts: {},
    })
  }

  const forward: ForwardTopicMsg<Domain> = ({ source, target, key }) => {
    return mainNodePersistence.addForward({
      key,
      src: { domain, topic: source },
      trg: { domain, topic: target },
    })
  }

  const consume: Consume<Domain> = ({ target, handler, qName }) => {
    const topic = fullTopic(target)

    const durable = !qName
    qName = qName || `MAIN_CONSUMER:${target}`
    domainConsume({
      domain,
      qName,
      opts: { queue: { durable } },
      topic,
      handler({ msg, msgJsonContent }) {
        const headers = getMsgHeader(msg)

        const unforward = () => {
          if (!headers.forwardedFrom) {
            return
          }
          return mainNodePersistence.removeForward({
            src: headers.forwardedFrom,
            trg: { domain, topic },
          })
        }
        const key = headers.forwardedFrom?.topic.split('.').slice(-1)[0]

        return handler({
          payload: msgJsonContent,
          key: key as any,
          forwarded: headers.forwardedFrom && {
            src: headers.forwardedFrom,
            unforward,
          },
        }).then(
          (resp) => {
            if (msg.properties.replyTo) {
              sendToQueue({ name: msg.properties.replyTo, content: resp })
            }
            return Acks.ack
          },
          (err) => {
            if (msg.properties.replyTo) {
              const replyError: ReplyError = { ___ERROR: String(err) }
              sendToQueue({ content: replyError, name: msg.properties.replyTo })
            }
            return Acks.reject
          }
        )
      },
    })
  }

  return {
    publish,
    forward,
    consume,
  }
}

const fullTopic = (_: string[]) => _.join('.')
