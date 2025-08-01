import { motion } from 'framer-motion';
import { Briefcase, Shield, TrendingUp, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">About <span className="text-gradient">Elevate</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Redefining wealth management with institutional-grade investment opportunities for corporates and high-net-worth individuals.
          </p>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm premium-card">
            <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg mb-6">
              At Elevate, we're on a mission to democratize access to institutional-grade investment opportunities while maintaining the highest standards of security, transparency, and performance.
            </p>
            <p className="text-lg">
              We believe that wealth management should be accessible, transparent, and efficient. Our platform bridges the gap between corporate treasuries and investment opportunities, enabling seamless Inter-Corporate Deposits and curated bond portfolios through a secure digital interface.
            </p>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-semibold mb-10 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm premium-card">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Security & Compliance</h3>
              <p className="text-muted-foreground">
                We adhere to the highest standards of security and regulatory compliance, ensuring your investments are protected and managed responsibly.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm premium-card">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Performance-Driven</h3>
              <p className="text-muted-foreground">
                Our curated investment opportunities are selected with a focus on risk-adjusted returns, helping you optimize your portfolio performance.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm premium-card">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Institutional Expertise</h3>
              <p className="text-muted-foreground">
                Benefit from our team's deep expertise in corporate treasury, fixed income markets, and wealth management, bringing institutional knowledge to your fingertips.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm premium-card">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Client-Centric Approach</h3>
              <p className="text-muted-foreground">
                Our platform is designed with your needs at its core, providing intuitive interfaces, transparent information, and dedicated support for all stakeholders.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Leadership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-semibold mb-10 text-center">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center premium-card">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">RK</span>
              </div>
              <h3 className="text-xl font-medium">Rajiv Kumar</h3>
              <p className="text-primary mb-2">CEO & Founder</p>
              <p className="text-sm text-muted-foreground">
                Former Head of Treasury at a leading financial institution with 20+ years of experience in corporate finance.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center premium-card">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">AS</span>
              </div>
              <h3 className="text-xl font-medium">Ananya Shah</h3>
              <p className="text-primary mb-2">CTO</p>
              <p className="text-sm text-muted-foreground">
                Fintech innovator with expertise in building secure, scalable platforms for financial services.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center premium-card">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">VP</span>
              </div>
              <h3 className="text-xl font-medium">Vikram Patel</h3>
              <p className="text-primary mb-2">Chief Investment Officer</p>
              <p className="text-sm text-muted-foreground">
                Seasoned investment professional with deep expertise in fixed income markets and portfolio management.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;