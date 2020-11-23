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
import { persistence } from './domain.env'
import { DomainTopic } from './impl/persistence/types'
import { Consume, ForwardTopicMsg, Publish, ReplyError } from './types'

type DomainMsgHeaders = Partial<{ forwardedFrom: DomainTopic }>
const DomainMsgHeaderProp = `x-sys-domain-header`

const mkMsgHeader = (_: DomainMsgHeaders) => ({ [DomainMsgHeaderProp]: _ })
const getMsgHeader = (msg: Message): DomainMsgHeaders =>
  msg.properties.headers[DomainMsgHeaderProp] || {}

export const domain = <Domain>(domain: string) => {
  const publish: Publish<Domain> = async ({ trgTopicPath, payload, replyCb }) => {
    const opts: DomainPublishOpts = {}

    persistence
      .getForwards({
        src: { domain, topic: String(trgTopicPath) },
      })
      .then((forwards) =>
        forwards.forEach((fwd) => {
          domainPublish({
            payload,
            domain: fwd.domain,
            topic: fwd.topic,
            opts: {
              headers: mkMsgHeader({ forwardedFrom: { domain, topic: String(trgTopicPath) } }),
            },
          })
        })
      )

    if (replyCb) {
      const qName = newUuid()
      opts.replyTo = qName
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
      topic: String(trgTopicPath),
      opts: {},
    })
  }

  const forward: ForwardTopicMsg<Domain> = ({ srcTopicPath, trgTopicPath }) => {
    return persistence.addForward({
      src: { domain, topic: String(srcTopicPath) },
      trg: { domain, topic: String(trgTopicPath) },
    })
  }

  const consume: Consume<Domain> = ({ trgTopicPath, handler, qName }) => {
    domainConsume({
      domain,
      qName,
      topic: String(trgTopicPath),
      handler({ msg, msgJsonContent }) {
        const head = getMsgHeader(msg)

        const unforward = () => {
          if (!head.forwardedFrom) {
            return
          }
          return persistence.removeForward({
            src: head.forwardedFrom,
            trg: { domain, topic: String(trgTopicPath) },
          })
        }
        //@ts-expect-error
        return handler({
          payload: msgJsonContent,
          forward: head.forwardedFrom && {
            src: head.forwardedFrom,
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
