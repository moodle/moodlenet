export type Package = {
  name: string
  creator: string
  description?: string
  logo?: string
  modules: Module[]
  links?: {
    homepage?: string
  }
  readme?: Promise<string>

  mandatory?: boolean
}
export type Module = {
  name: string
  enabled: boolean
  mandatory?: boolean
}

export const mandatoryPackages = [
  '@moodlenet/core',
  '@moodlenet/authentication-manager',
  '@moodlenet/extensions-manager',
  '@moodlenet/http-server',
  '@moodlenet/webapp',
  '@moodlenet/react-app',
  '@moodlenet/web-user',
]

export const packagesFake: Package[] = [
  {
    name: 'Core',
    creator: 'Moodle',
    mandatory: true,
    logo: '../../../../assets/logos/@moodlenet/logo-small.svg',
    modules: [
      { name: 'Core', enabled: true, mandatory: true },
      { name: 'Main', enabled: true, mandatory: true },
      { name: 'Web app', enabled: true, mandatory: true },
      { name: 'Http server', enabled: false, mandatory: true },
      { name: 'Pri Http', enabled: true, mandatory: true },
      { name: 'Content graph', enabled: true, mandatory: false },
      { name: 'Authentification', enabled: false },
    ],
  },
  {
    name: 'Test package',
    creator: 'MoodleNet developers',
    modules: [{ name: 'Test modules', enabled: true }],
  },
]
