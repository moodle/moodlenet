import { bind, stub, umbrella } from './Stub'

// const srv = async <T>(a: T, b: number) => ({
//   a,
//   b: b + 1000,
// })
type Srv = <X extends unknown>(a: X, b: number) => Promise<{ a: X; b: number }>
const srv = stub<Srv>(['my', 'namespace'])

umbrella(async ({ args: [a, b] }) => ({ a, b: b + 5000 }))
;(async () => {
  // bind<Srv>(['my', 'namespace'], async (x, b) => ({ a: x, b: b + 100000 }))
  bind(srv, async (a, b) => ({ a, b: b + 1000 }))
  const x = await srv({ x: 1 }, 2)
  console.log({ x })
  const y = await srv({ Xx: 2 }, 4)
  console.log({ y })
})()
