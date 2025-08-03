import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import LoginSection from '@/components/sections/LoginSection';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Elevate</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Premium wealth investments, simplified.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/register">
            <Button className="w-full md:w-auto">Sign Up as Investor</Button>
          </Link>
          <Link to="/WealthPartnerRegister">
            <Button className="w-full md:w-auto">Sign Up as Wealth Partner</Button>
          </Link>
          <Link to="/AdminRegister">
            <Button className="w-full md:w-auto">Sign Up as Admin</Button>
          </Link>
        </div>
      </div>
      <HeroSection />
      <FeaturesSection />
      <LoginSection />
    </div>
  );
};

export default Home;