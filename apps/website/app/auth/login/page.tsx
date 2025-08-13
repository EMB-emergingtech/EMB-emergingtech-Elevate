import { LoginSection } from '@/components/sections/LoginSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Elevate Wealth Management',
  description: 'Login to your account'
};

export default function LoginPage() {
  return <LoginSection />;
}