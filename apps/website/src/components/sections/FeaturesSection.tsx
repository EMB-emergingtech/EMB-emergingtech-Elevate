import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Building, LineChart, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: "Direct ICD Marketplace",
    description: "Investors can directly raise and manage Inter-Corporate Deposit requests. Corporates can find attractive short-term financing options seamlessly."
  },
  {
    icon: <LineChart className="h-8 w-8 text-primary" />,
    title: "Curated Bond Portfolios",
    description: "Access a curated selection of high-yield government and corporate bonds. View detailed information and performance analytics before investing."
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: "Role-Based Dashboards",
    description: "Tailored dashboards for Investors, Wealth Partners, and Admins provide a comprehensive overview and control over your specific activities."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            A Platform Built for <span className="text-gradient">Performance and Trust</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive solution empowers financial institutions and high-net-worth individuals with powerful tools and insights.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full premium-card">
                <CardContent className="pt-6">
                  <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;