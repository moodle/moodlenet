export type Package = {
  name: string
  modules: Module[]
}
export type Module = {
  name: string
  enabled: boolean
  mandatory?: boolean
}

export const packagesFake: Package[] = [
  {
    name: 'Core',
    modules: [
      { name: 'Kernel', enabled: true, mandatory: true },
      { name: 'Main', enabled: true, mandatory: true },
      { name: 'Web app', enabled: true, mandatory: true },
      { name: 'Http server', enabled: false, mandatory: true },
      { name: 'Pri Http', enabled: true, mandatory: true },
      { name: 'Content graph', enabled: true, mandatory: true },
      { name: 'Authentification', enabled: false },
    ],
  },
  {
    name: 'Test package',
    modules: [{ name: 'Test modules', enabled: true }],
  },
]
