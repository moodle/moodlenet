'use server'

import { ClientComponent } from './ClientComponent'

export default async function Page() {
  const buttonAction = await curriedAction(`SERVER XCURR ${rnd()}`)
  return <ClientComponent buttonAction={buttonAction} value={`BTN VAL INIT[${rnd()}]`} />
}

async function curriedAction(curriedValue: string) {
  console.log(`CREATE XCURR action on curriedValue:${curriedValue}`)
  return async function performCurriedAction(paramFromClient: string) {
    'use server'
    console.log(`PERFORM XCURR action on curriedValue:${curriedValue} and paramFromClient:${paramFromClient}`)
    const buttonAction = await curriedAction(`MORE CUR[${curriedValue}::${paramFromClient}]`)
    const val = `BTN VAL MORE ${paramFromClient}[${rnd()}]`
    return <ClientComponent buttonAction={buttonAction} key={val} value={val} />
  }
}

function rnd() {
  return `${Math.random()}`.substring(3, 7)
}
