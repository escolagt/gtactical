import { Header } from '@/components/Header';
import BrandBanner from "@/components/BrandBanner";
import { About } from '@/components/About';
import { Courses } from '@/components/Courses';
import { Benefits } from '@/components/Benefits';
import { Testimonials } from '@/components/Testimonials';
import { Schedule } from '@/components/Schedule';
import { LeadForm } from '@/components/LeadForm';
import { Faq } from '@/components/Faq';
import { ContactMap } from '@/components/ContactMap';
import { Footer } from '@/components/Footer';
import Showcase3D from "@/components/Showcase3D";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Showcase3D /> 
        <BrandBanner />
        <About />
        <Courses />
        <Benefits />
        <Testimonials />
        <Schedule />
        <LeadForm />
        <Faq />
        <ContactMap />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
