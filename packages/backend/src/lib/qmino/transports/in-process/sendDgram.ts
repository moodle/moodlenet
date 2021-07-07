import { createSocket } from 'dgram'

const [type, portName, args, portStr = '36715', address = 'localhost'] = process.argv.slice(2)
const port = Number(portStr)
const socket = createSocket({ type: 'udp4' })
const msg = `qmino:${type}::${portName}##${args}`
console.log(`sending msg :
${msg}
to ${address}:${port}
`)
socket.send(msg, port, address, (err, bytes) => {
  console.log({ err, bytes })
  socket.close()
})
