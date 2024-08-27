export interface WebsiteInfo {
  title: string
  subtitle: string
  logo: string
  smallLogo: string
  deployment: {
    domain: string
    secure: boolean
    basePath: string
  }
}
