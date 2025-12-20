import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setIsLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get In <span className="text-primary">Touch</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Ready to secure your digital assets? Contact us for a free consultation 
                and let our experts help you build a robust security strategy.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">Email Us</h3>
                  <p className="text-muted-foreground">contact@apnisec.com</p>
                  <p className="text-muted-foreground">security@apnisec.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">Call Us</h3>
                  <p className="text-muted-foreground">+91 123 456 7890</p>
                  <p className="text-muted-foreground">+91 098 765 4321</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">Visit Us</h3>
                  <p className="text-muted-foreground">
                    Cyber Tower, Floor 15<br />
                    Tech Park, Whitefield<br />
                    Bangalore, India 560001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-secondary/50 rounded-lg p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    className="bg-background border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="bg-background border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-foreground">
                  Company
                </label>
                <Input
                  id="company"
                  placeholder="Your Company"
                  className="bg-background border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your security needs..."
                  rows={4}
                  required
                  className="bg-background border-border focus:border-primary resize-none"
                />
              </div>

              <Button type="submit" variant="cyber" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
