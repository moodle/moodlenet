import { DomainTransport } from '@mn-be/domainTransport/DomainTransportTypes'
import { DomainApiMap } from '../DomainTypes'
import { TestDomain } from './TestDomainTypes'

export type Cfg = {
  trnsp: DomainTransport<TestDomain>
}

export const makeTestDomain = ({ trnsp }: Cfg): DomainApiMap<TestDomain> => {
  const testApi: DomainApiMap<TestDomain>['testApi'] = ({
    req: { amount, errorAt, to },
    id,
    push,
  }) => {
    const sign = `testApi - amount:${amount}, errorAt:${errorAt}, to:${to}, id:${id}`
    let index = 1
    l('got :', sign)

    const pushIt = () => {
      l('pushing index :', index)
      if (index === errorAt) {
        clearInterval(reqIntId)
        const error = { res: { error: `errorAt:${errorAt}`, sign }, end: true }
        l('pushing Error :', sign, error)
        push(error)
      } else {
        const end = index === amount
        end && clearInterval(reqIntId)
        const data = {
          res: {
            rnd: Math.random(),
            sign,
          },
          end,
        }
        l('pushing data :', sign, data)
        push(data)
      }
      index++
    }
    const reqIntId = setInterval(pushIt, to)

    const requestUnsub = () => {
      l('Domain API got unsub, cleanup :', sign)
      clearInterval(reqIntId)
    }
    return requestUnsub
  }

  const intId = setInterval(() => {
    trnsp.pub({ type: 'testEvent', payload: { tst: Math.random() } })
  }, 1000)

  clearInterval(intId)

  return {
    testApi,
  }
}

const l = (...args: any[]) => console.log(...args, '\n')
