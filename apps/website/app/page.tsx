import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}