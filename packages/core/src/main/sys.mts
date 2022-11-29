export function rebootSystem(to = 500) {
  setTimeout(() => process.exit(0), to)
}
