'use client'

import { ReactElement, useReducer } from 'react'

export function ClientComponent({
  buttonAction,
  value,
}: {
  value: string
  buttonAction(paramFromClient: string): Promise<ReactElement>
}) {
  const [btns, addBtn] = useReducer((state: ReactElement[], action: ReactElement) => [...state, action], [])
  return (
    <div style={{ paddingLeft: '10px' }}>
      <button onClick={() => buttonAction(`CLI VAL ${value}[${rnd()}]`).then(addBtn)}>click {value}</button>
      {btns}
    </div>
  )
}

function rnd() {
  return `${Math.random()}`.substring(3, 7)
}
