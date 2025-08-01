import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img 
              src="https://storage.googleapis.com/fenado-ai-farm-public/generated/ec4b9b57-ba68-41de-81cc-5150e005781f.webp" 
              alt="Elevate Logo" 
              className="h-8 w-auto" 
            />
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">© {currentYear} Elevate. All Rights Reserved.</span>
              <span className="beta-tag">beta</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <a 
              href="mailto:contact@elevate-demo.com" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;