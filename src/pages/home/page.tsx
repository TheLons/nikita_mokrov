import Navigation from './components/Navigation';
import HeroSplitSection from './components/HeroSplitSection';
import BiographySection from './components/BiographySection';
import WorksSection from './components/WorksSection';
import ContactSection from './components/ContactSection';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#121212', color: '#F5F5F5' }}>
      <Navigation />
      <HeroSplitSection />
      <BiographySection />
      <WorksSection />
      <ContactSection />
    </div>
  );
}
