import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import ServicesSection from '@/components/landing/ServicesSection';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section when navigating from other pages
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <>
      <Helmet>
        <title>ApniSec - Enterprise Cybersecurity Solutions | Cloud Security, VAPT, Red Team</title>
        <meta name="description" content="ApniSec provides cutting-edge cybersecurity solutions including Cloud Security, Red Team Assessments, and comprehensive VAPT services to protect your organization from evolving digital threats." />
        <meta name="keywords" content="cybersecurity, cloud security, VAPT, penetration testing, red team, security consulting, threat intelligence" />
        <meta property="og:title" content="ApniSec - Enterprise Cybersecurity Solutions" />
        <meta property="og:description" content="Protecting your digital assets with cutting-edge cybersecurity solutions." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://apnisec.com" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <ServicesSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
