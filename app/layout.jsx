import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  title: {
    default: 'AppDispatch Docs',
    template: '%s – AppDispatch Docs',
  },
  description: 'Ship OTA updates and feature flags for Expo & React Native',
}

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
        AppDispatch
      </span>
    }
    projectLink="https://github.com/AppDispatch"
  />
)

const footer = (
  <Footer>
    {new Date().getFullYear()} © AppDispatch
  </Footer>
)

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head
        color={{ hue: 245, saturation: 100, lightness: 67 }}
      />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/AppDispatch/devdocs/tree/main"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
