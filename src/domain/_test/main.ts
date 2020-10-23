import * as D from '@mn-be/wireup/monolythic'
const l = (...args: any[]) => console.log(...args, '\n\n')

//@ts-ignore
global.testapi = ({
  amount = 4,
  errorAt = 4,
  to = 1000,
}: {
  amount: number
  errorAt: number
  to: number
}) => {
  const id = D._testDomainTransport.apiReq({
    apiName: 'testApi',
    req: { amount, errorAt, to },
  })
  const unsub = D._testDomainTransport.subApiRes({
    apiName: 'testApi',
    id,
    responseHandler: (responseEvent) => {
      l('test responseHandler responseEvent:', responseEvent)
    },
  })
  return { id, unsub }
}

l(`({unsub,id} = testapi({amount:20,errorAt:0,to:2000}))`)

//@ts-ignore
global.messageTransport = D.transport
//@ts-ignore
global.emailDomain = D.emailDomain
//@ts-ignore
global._testDomain = D._testDomain
setInterval(() => {}, 10000)
