import * as D from '@mn-be/wireup/monolythic'
const l = (...args: any[]) => console.log(...args, '\n\n')

const testapi = ({
  amount = 4,
  errorAt = 4,
  to = 1000,
}: {
  amount: number
  errorAt: number
  to: number
}) => {
  const api = D._testDomainTransport.callApi({
    apiName: 'testApi',
    req: { amount, errorAt, to },
    responseHandler: (responseEvent) => {
      l('test responseHandler responseEvent:', responseEvent)
    },
  })
  return api
}
testapi({ amount: 10, errorAt: 2, to: 200 })

// D.emailDomainTransport.callApi({
//   apiName: 'sendEmail',
//   req: {
//     from: '"MN!" <moo@net.com>',
//     text: '**',
//     subject: '??',
//     to: ['alessandsro.giansanti@gmail.com'],
//   },
//   responseHandler: (_) => {
//     l('emailDomainTransport responseHandler', _)
//   },
// })

setInterval(() => {}, 10000)

l(`([unsub,id] = testapi({amount:20,errorAt:0,to:1000}))`, D)
