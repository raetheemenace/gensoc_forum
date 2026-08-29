import Navbar from './Navbar';
import Hero from './Hero';
import Theories from './Theories';
import FeministTheories from './FeministTheories';
import ModernCritiques from './ModernCritiques';
import AntiOppressive from './AntiOppressive';
import LearningOutcomes from './LearningOutcomes';
import Forum from './Forum';
import Footer from './Footer';

export default function MainContent() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full flex flex-col gap-20 md:gap-32">
        <Theories />
        <FeministTheories />
        <ModernCritiques />
        <AntiOppressive />
      </div>
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full flex flex-col gap-16 md:gap-24">
          <Forum />
          <LearningOutcomes />
        </div>
      </div>
      <Footer />
    </div>
  );
}
