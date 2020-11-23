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
  const publish: Publish<Domain> = async ({ target, payload, replyCb }) => {
    const opts: DomainPublishOpts = {}

    mainNodePersistence
      .getForwards({
        src: { domain, topic: target },
      })
      .then((forwards) =>
        forwards.forEach((fwd) => {
          domainPublish({
            payload,
            domain: fwd.domain,
            topic: fwd.topic,
            opts: {
              headers: mkMsgHeader({ forwardedFrom: { domain, topic: target } }),
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
      topic: target,
      opts: {},
    })
  }

  const forward: ForwardTopicMsg<Domain> = ({ source, target }) => {
    return mainNodePersistence.addForward({
      src: { domain, topic: topicString(source) },
      trg: { domain, topic: topicString(target) },
    })
  }

  const consume: Consume<Domain> = ({ target, handler, qName }) => {
    const durable = !qName
    qName = qName || `MAIN_CONSUMER:${target}`
    domainConsume({
      domain,
      qName,
      opts: { queue: { durable } },
      topic: target,
      handler({ msg, msgJsonContent }) {
        const head = getMsgHeader(msg)

        const unforward = () => {
          if (!head.forwardedFrom) {
            return
          }
          return mainNodePersistence.removeForward({
            src: head.forwardedFrom,
            trg: { domain, topic: target },
          })
        }

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

const topicString = (_: readonly string[]) => _.reduce((_, s) => `${_}.${s}`, ``)
