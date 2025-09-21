import { React, lazy, Suspense } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lazy load sections for better performance
const HeroSection = lazy(() => import('./Sections/HeroSection'));
const FeaturedDestinations = lazy(() => import('./Sections/FeaturedDestinations'));
const PopularExperiences = lazy(() => import('./Sections/PopularExperiences'));
const TravelTipsPreview = lazy(() => import('./Sections/TravelTipsPreview'));
const NewsletterSignup = lazy(() => import('./Sections/NewsletterSignup'));

const Home = () => {
  return (
    <div className="home-page">
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedDestinations />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <PopularExperiences />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <TravelTipsPreview />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <NewsletterSignup />
      </Suspense>
    </div>
  );
};

export default Home;