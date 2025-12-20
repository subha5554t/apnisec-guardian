import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Lock, Zap } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Scan Line Effect */}
      <div className="scan-line pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-mono animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <Shield className="h-4 w-4" />
            <span>Enterprise-Grade Security Solutions</span>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Securing Your{' '}
            <span className="text-primary text-glow">Digital Future</span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            ApniSec provides cutting-edge cybersecurity solutions including Cloud Security, 
            Red Team Assessments, and comprehensive VAPT services to protect your organization 
            from evolving digital threats.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <Link to="/register">
              <Button variant="cyber" size="xl" className="group">
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="cyber-outline" size="xl">
                Explore Services
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-primary font-mono">500+</div>
              <div className="text-muted-foreground text-sm mt-1">Clients Protected</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-primary font-mono">99.9%</div>
              <div className="text-muted-foreground text-sm mt-1">Threat Detection</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-primary font-mono">24/7</div>
              <div className="text-muted-foreground text-sm mt-1">Monitoring</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl md:text-4xl font-bold text-primary font-mono">10K+</div>
              <div className="text-muted-foreground text-sm mt-1">Issues Resolved</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 hidden lg:block animate-float">
          <div className="p-3 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-1/4 right-10 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
          <div className="p-3 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
            <Zap className="h-6 w-6 text-accent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
