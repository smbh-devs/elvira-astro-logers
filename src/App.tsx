import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { WhatYouGet } from '@/components/WhatYouGet';
import { HowItWorks } from '@/components/HowItWorks';
import { About } from '@/components/About';
import { Reviews } from '@/components/Reviews';
import { LeadForm } from '@/components/LeadForm';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { PaymentResult } from '@/components/PaymentResult';

function App() {
  return (
    <div className="min-h-screen bg-ivory-100">
      <Header />
      <main>
        <Hero />
        <WhatYouGet />
        <About />
        <Reviews />
        <HowItWorks />
        <LeadForm />
        <FAQ />
      </main>
      <Footer />
      <PaymentResult />
    </div>
  );
}

export default App;
