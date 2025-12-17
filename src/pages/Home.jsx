// src/pages/Home.jsx

import React from 'react';
import BannerSection from '../components/Home/BannerSection';
import LatestResolvedIssues from '../components/Home/LatestResolvedIssues';
import FeaturesSection from '../components/Home/FeaturesSection';
import HowItWorks from '../components/Home/HowItWorks';
import StatsSection from '../components/Home/StatsSection';
import CTASection from '../components/Home/CTASection';

const Home = () => {
  return (
    <div>
      {/* 1. Banner Section */}
      <BannerSection />

      {/* 2. Latest Resolved Issues */}
      <LatestResolvedIssues />

      {/* 3. Application Features Section */}
      <FeaturesSection />

      {/* 4. How It Works Section */}
      <HowItWorks />

      {/* 5. Stats Section (Extra Section 1) */}
      <StatsSection />

      {/* 6. CTA Section (Extra Section 2) */}
      <CTASection />
    </div>
  );
};

export default Home;