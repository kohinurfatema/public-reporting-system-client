// src/pages/Home.jsx

import React from 'react';
import BannerSection from '../components/Home/BannerSection';
import LatestResolvedIssues from '../components/Home/LatestResolvedIssues';
import CategoriesSection from '../components/Home/CategoriesSection';
import FeaturesSection from '../components/Home/FeaturesSection';
import HowItWorks from '../components/Home/HowItWorks';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import StatsSection from '../components/Home/StatsSection';
import FAQSection from '../components/Home/FAQSection';
import NewsletterSection from '../components/Home/NewsletterSection';
import CTASection from '../components/Home/CTASection';

const Home = () => {
  return (
    <div>
      {/* 1. Hero/Banner Section */}
      <BannerSection />

      {/* 2. Latest Resolved Issues */}
      <LatestResolvedIssues />

      {/* 3. Issue Categories */}
      <CategoriesSection />

      {/* 4. Application Features */}
      <FeaturesSection />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Testimonials */}
      <TestimonialsSection />

      {/* 7. Statistics */}
      <StatsSection />

      {/* 8. FAQ */}
      <FAQSection />

      {/* 9. Newsletter */}
      <NewsletterSection />

      {/* 10. Call to Action */}
      <CTASection />
    </div>
  );
};

export default Home;
