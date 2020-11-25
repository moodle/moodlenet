import { aql } from 'arangojs'
import { DomainPersistence, DomainTopic, Forward } from '../types'
import { Forwards } from './collections'
import { db, log } from './domain.arango.env'

const forwardKey = (_: DomainTopic, key: string) => `${_.domain}__${_.topic}_${key}`
const addForward: DomainPersistence['addForward'] = async ({ src, trg, key }) => {
  log([`addForward`, { src, trg, key }], 0)
  const frw: Forward = { src, trg: [trg] }
  return db.query(aql`
    UPSERT ${forwardKey(src, key)}
        INSERT ${frw} 
        UPDATE { trg: UNIQUE(PUSH(OLD.trg, ${trg}))}
    IN Forwards
  `)
}

const removeForward: DomainPersistence['removeForward'] = async ({ src, trg, key }) => {
  log([`removeForward`, { src, trg }], 0)
  return db.query(aql`
    UPDATE ${forwardKey(src, key)}
    WITH { trg: REMOVE_VALUE(OLD.trg, ${trg}, 1)}
    IN Forwards
  `)
}

const getForwards: DomainPersistence['getForwards'] = async ({ src, key }) => {
  log([`getForwards`, { src }], 0)
  return Forwards.document({ _key: forwardKey(src, key) })
    .then(
      (doc) => doc.trg,
      (err) => {
        console.log(err)
        return []
      }
    )
    .then((_) => (log([`Forwards for`, { src }, _], 0), _))
}

export const arangoPersistence: DomainPersistence = {
  addForward,
  removeForward,
  getForwards,
}
