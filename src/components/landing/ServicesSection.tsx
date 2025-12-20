import { Cloud, Target, Shield, Lock, Search, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    icon: Cloud,
    title: 'Cloud Security',
    description: 'Comprehensive cloud infrastructure protection including AWS, Azure, and GCP security assessments, configuration reviews, and compliance monitoring.',
    features: ['Cloud Configuration Audit', 'Identity & Access Management', 'Data Encryption'],
  },
  {
    icon: Target,
    title: 'Red Team Assessment',
    description: 'Simulate real-world attacks to identify vulnerabilities before malicious actors do. Our red team experts use advanced techniques to test your defenses.',
    features: ['Social Engineering', 'Physical Security Testing', 'Network Penetration'],
  },
  {
    icon: Shield,
    title: 'VAPT Services',
    description: 'Vulnerability Assessment and Penetration Testing to identify, evaluate, and address security weaknesses in your applications and infrastructure.',
    features: ['Web Application Testing', 'Mobile App Security', 'API Security Testing'],
  },
  {
    icon: Lock,
    title: 'Security Consulting',
    description: 'Expert guidance on security strategy, policy development, and implementation of best practices tailored to your organization.',
    features: ['Risk Assessment', 'Compliance Advisory', 'Security Architecture'],
  },
  {
    icon: Search,
    title: 'Threat Intelligence',
    description: 'Stay ahead of emerging threats with our continuous monitoring and intelligence services that provide actionable security insights.',
    features: ['Dark Web Monitoring', 'Threat Analysis', 'Incident Response'],
  },
  {
    icon: Server,
    title: 'Infrastructure Security',
    description: 'Protect your critical infrastructure with our comprehensive security solutions for networks, servers, and endpoints.',
    features: ['Network Security', 'Endpoint Protection', 'Security Monitoring'],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Security Services</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive cybersecurity solutions designed to protect your organization 
            from modern threats and ensure business continuity.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="bg-secondary/50 border-border hover:border-primary/50 transition-all duration-300 card-hover group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-300">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
