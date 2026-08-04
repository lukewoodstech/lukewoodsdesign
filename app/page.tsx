import About from '@/components/About'
import SiteNav from '@/components/SiteNav'
import WorkGrid from '@/components/WorkGrid'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <SiteNav />
      <About />
      <WorkGrid />
      <Footer />
    </>
  )
}
