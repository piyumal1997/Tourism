import { React, lazy, Suspense } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lazy load sections for better performance
const HeroSection = lazy(() => import('./sections/HeroSection'));
const FeaturedDestinations = lazy(() => import('./sections/FeaturedDestinations'));
const PopularExperiences = lazy(() => import('./sections/PopularExperiences'));
const TravelTipsPreview = lazy(() => import('./sections/TravelTipsPreview'));
const NewsletterSignup = lazy(() => import('./sections/NewsletterSignup'));

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