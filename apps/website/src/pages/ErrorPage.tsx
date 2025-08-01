import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative overflow-hidden flex items-center justify-center p-8">
      {/* Themed background elements */}
      <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl top-0 -right-48 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-primary/3 rounded-full blur-3xl -bottom-20 -left-20"></div>
      <div className="absolute w-64 h-64 bg-accent/10 rounded-full blur-2xl top-1/4 -left-20"></div>
      
      {/* Floating geometric elements */}
      <div className="absolute top-20 left-20 w-8 h-8 border-2 border-primary/20 rotate-45 animate-pulse"></div>
      <div className="absolute top-1/3 right-16 w-6 h-6 bg-primary/20 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/3 left-12 w-4 h-4 bg-accent/30 rotate-12 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 right-24 w-10 h-10 border border-primary/30 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>

      {/* Main error content */}
      <div className="relative z-10 bg-card/80 backdrop-blur-sm border border-border shadow-2xl rounded-3xl p-10 max-w-md w-full text-center premium-card">
        
        {/* Error icon */}
        <div className="mb-6 relative inline-block">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/30 rounded-full opacity-20 blur-lg animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-muted to-accent rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Error code */}
        <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          404
        </h1>
        
        {/* Decorative line */}
        <div className="w-16 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 mx-auto my-6 rounded-full"></div>
        
        {/* Error message */}
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            asChild 
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 gap-2 elevate-glow"
          >
            <Link to="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/5"
          >
            <Link to="/login">
              Go to Login
            </Link>
          </Button>
        </div>

        {/* Additional links */}
        <div className="mt-8 flex justify-center gap-4 text-sm">
          <Link to="/contact" className="text-primary hover:underline">Contact Support</Link>
          <Link to="/about" className="text-primary hover:underline">About Elevate</Link>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-30"></div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-30"></div>
    </div>
  );
}