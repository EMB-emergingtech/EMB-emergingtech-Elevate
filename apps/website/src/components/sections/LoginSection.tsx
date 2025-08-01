import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Building2, ShieldCheck } from 'lucide-react';

const LoginSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [activeTab, setActiveTab] = useState('password');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOtpSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      
      // Start countdown
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast.success("OTP sent to +91 ******9876");
    }, 1000);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login successful");
      navigate("/dashboard/investor");
    }, 1000);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("OTP verified successfully");
      navigate("/dashboard/investor");
    }, 1000);
  };

  const handleQuickLogin = (role: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Logged in as ${role}`);
      
      switch (role) {
        case 'Investor':
          navigate("/dashboard/investor");
          break;
        case 'Wealth Partner':
          navigate("/dashboard/partner");
          break;
        case 'Admin':
          navigate("/dashboard/admin");
          break;
      }
    }, 1000);
  };

  return (
    <section id="login" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome to the <span className="text-gradient">Elevate Demo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            For demonstration purposes, please use the predefined credentials below to access the respective dashboards. All workflows are simulated with mock data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Quick login buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Quick Demo Access</CardTitle>
                <CardDescription>
                  Choose a role to instantly access the respective dashboard with pre-filled demo credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleQuickLogin('Investor')}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 h-12 elevate-glow"
                >
                  <UserCircle className="h-5 w-5" />
                  Login as Investor
                </Button>
                <Button
                  onClick={() => handleQuickLogin('Wealth Partner')}
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2 h-12 elevate-glow"
                >
                  <Building2 className="h-5 w-5" />
                  Login as Wealth Partner
                </Button>
                <Button
                  onClick={() => handleQuickLogin('Admin')}
                  disabled={isLoading}
                  className="w-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center gap-2 h-12 elevate-glow"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Login as Admin
                </Button>
                
                <div className="pt-4 text-sm text-muted-foreground">
                  <p className="text-center">Demo credentials:</p>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="p-2 bg-muted/50 rounded-md text-center">
                      <p className="font-mono text-xs">investor@elevate.demo</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-md text-center">
                      <p className="font-mono text-xs">partner@elevate.demo</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-md text-center">
                      <p className="font-mono text-xs">admin@elevate.demo</p>
                    </div>
                  </div>
                  <p className="text-center mt-2">Password for all: <span className="font-mono">demo123</span></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Manual login form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="premium-card">
              <CardHeader>
                <CardTitle>Manual Login</CardTitle>
                <CardDescription>
                  Enter your credentials or use the OTP option to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="password" 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="password">Email & Password</TabsTrigger>
                    <TabsTrigger value="otp">Mobile OTP</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="password">
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="email@example.com"
                          defaultValue="investor@elevate.demo"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Button variant="link" className="text-xs p-0 h-auto" type="button">
                            Forgot Password?
                          </Button>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••"
                          defaultValue="demo123"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
                        disabled={isLoading}
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="otp">
                    {!otpSent ? (
                      <form onSubmit={handleOtpSend} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="mobile">Mobile Number or Email</Label>
                          <Input 
                            id="mobile" 
                            type="text" 
                            placeholder="+91 9876543210 or email@example.com"
                            defaultValue="+91 9876543210"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleOtpVerify} className="space-y-4">
                        <div className="mb-6 text-center">
                          <p className="text-sm text-muted-foreground mb-1">OTP sent to +91 ******9876</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="otp">Enter 6-digit OTP</Label>
                          <Input 
                            id="otp" 
                            type="text" 
                            placeholder="123456"
                            defaultValue="123456"
                            maxLength={6}
                            className="text-center text-lg font-mono"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground elevate-glow"
                          disabled={isLoading}
                        >
                          {isLoading ? "Verifying..." : "Verify & Login"}
                        </Button>
                        <div className="flex justify-between items-center pt-2">
                          <Button 
                            variant="link" 
                            className="text-xs p-0 h-auto" 
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setActiveTab('password');
                            }}
                          >
                            Use Password Instead
                          </Button>
                          <Button 
                            variant="link" 
                            className="text-xs p-0 h-auto" 
                            type="button"
                            disabled={countdown > 0}
                            onClick={() => {
                              if (countdown === 0) {
                                setOtpSent(false);
                                handleOtpSend({preventDefault: () => {}} as React.FormEvent);
                              }
                            }}
                          >
                            {countdown > 0 ? `Resend OTP (${countdown}s)` : "Resend OTP"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 pt-6 border-t border-border flex justify-between">
                  <Button variant="link" className="text-sm p-0">
                    New to Elevate?
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-sm border-primary text-primary hover:bg-primary/5"
                    onClick={() => navigate("/register")}
                  >
                    Have an invite code? Register here
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;