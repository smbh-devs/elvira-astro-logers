import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { PainPoints } from '@/components/PainPoints';
import { ValueProposition } from '@/components/ValueProposition';
import { Topics } from '@/components/Topics';
import { About } from '@/components/About';
import { Reviews } from '@/components/Reviews';
import { PriceComparison } from '@/components/PriceComparison';
import { LeadForm } from '@/components/LeadForm';
import { FAQ } from '@/components/FAQ';
import { Guarantee } from '@/components/Guarantee';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { PromoBanner } from '@/components/PromoBanner';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { PaymentResult } from '@/components/PaymentResult';

function App() {
  return (
    <div className="min-h-screen bg-ivory-100">
      <PromoBanner />
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <ValueProposition />
        <Topics />
        <About />
        <Reviews />
        <PriceComparison />
        <LeadForm />
        <FAQ />
        <Guarantee />
        <FinalCTA />
      </main>
      <Footer />
      <ChatWidget />
      <ExitIntentPopup />
      <PaymentResult />
    </div>
  );
}

export default App;
