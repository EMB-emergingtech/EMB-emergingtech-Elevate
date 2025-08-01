import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/forms/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <img 
                src="https://storage.googleapis.com/fenado-ai-farm-public/generated/ec4b9b57-ba68-41de-81cc-5150e005781f.webp" 
                alt="Elevate Logo" 
                className="h-12 w-auto" 
              />
            </Link>
            <h1 className="text-3xl font-bold mt-6 mb-2">Welcome to Elevate</h1>
            <p className="text-muted-foreground text-lg">Premium wealth investments, simplified.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;