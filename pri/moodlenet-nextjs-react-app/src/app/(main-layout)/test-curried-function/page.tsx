'use server'

import { ClientComponent } from './ClientComponent'

export default async function Page() {
  const buttonAction = await curriedAction(`SOME CURRIED SERIALIZABLE VALUE FROM SERVER`)
  return <ClientComponent buttonAction={buttonAction} value={'1'} />
}

async function curriedAction(curriedValue: string) {
  return async function performCurriedAction(paramFromClient: string) {
    'use server'
    console.log(`curried action on curriedValue:${curriedValue} and paramFromClient:${paramFromClient}`)
    const buttonAction = await curriedAction(`MORE ${paramFromClient}`)
    const key = `${paramFromClient} + ${String(Math.random()).substring(2, 8)}`
    return <ClientComponent buttonAction={buttonAction} key={key} value={key} />
  }
}
