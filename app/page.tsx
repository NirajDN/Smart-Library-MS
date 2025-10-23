import HeroSection from '@/components/home/HeroSection'
import NavbarSection from '@/components/home/NavbarSection'
import FeatureSection from '@/components/home/FeatureSection'
import QuoteSection from '@/components/home/QuoteSection'
import FAQSection from '@/components/home/FAQSection'

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavbarSection/>
      <HeroSection/>
      <FeatureSection/>
      <QuoteSection/>
      <FAQSection/>
    </div>
  )
}
