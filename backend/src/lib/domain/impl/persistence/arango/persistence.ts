import { aql } from 'arangojs'
import { DomainPersistence, DomainTopic, Forward } from '../types'
import { log } from './'
import { Forwards } from './collections'
import { db } from './domain.arango.env'

const forwardKey = (_: DomainTopic) => `${_.domain}__${_.topic}`
const addForward: DomainPersistence['addForward'] = async ({ src, trg: trg }) => {
  log([`addForward`, { src, trg }], 0)
  const frw: Forward = { src, trg: [trg] }
  return db.query(aql`
    UPSERT ${forwardKey(src)}
        INSERT ${frw} 
        UPDATE { trg: UNIQUE(PUSH(OLD.trg, ${trg}))}
    IN ${Forwards.name}
  `)
}

const removeForward: DomainPersistence['removeForward'] = async ({ src, trg }) => {
  log([`removeForward`, { src, trg }], 0)
  return db.query(aql`
    UPDATE ${forwardKey(src)}
    WITH { trg: REMOVE_VALUE(OLD.trg, ${trg}, 1)}
    IN ${Forwards.name}
  `)
}

const getForwards: DomainPersistence['getForwards'] = async ({ src }) => {
  log([`getForwards`, { src }], 0)
  return Forwards.document({ _key: forwardKey(src) })
    .then(
      (doc) => doc.trg,
      () => []
    )
    .then((_) => (log([`Forwards for`, { src }, _], 0), _))
}

const arangoPersistence: DomainPersistence = {
  addForward,
  removeForward,
  getForwards,
}
module.exports = arangoPersistence
