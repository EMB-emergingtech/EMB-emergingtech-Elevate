import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const metadata = {
  title: 'Elevate Wealth Management',
  description: 'Professional wealth management platform'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {children}
            <Toaster />
            <ThemeSwitcher />
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}