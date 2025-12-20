import { CheckCircle, Users, Award, Clock } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our team consists of certified security professionals with years of experience in protecting enterprise systems.',
  },
  {
    icon: Award,
    title: 'Industry Certified',
    description: 'We hold certifications including OSCP, CEH, CISSP, and AWS Security Specialty.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock security monitoring and incident response to keep your business protected.',
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose <span className="text-primary">ApniSec</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              At ApniSec, we understand that cybersecurity is not just about technology—it's about 
              protecting your business, your reputation, and your customers' trust. We combine 
              cutting-edge tools with human expertise to deliver comprehensive security solutions.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                'Tailored security solutions for your specific needs',
                'Proactive threat hunting and vulnerability management',
                'Compliance support for GDPR, ISO 27001, SOC 2',
                'Detailed reporting and actionable recommendations',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="flex gap-4 p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
