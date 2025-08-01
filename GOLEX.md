# GOLEX Knowledge Log

## Project Summary
Elevate is a sophisticated wealth-investment platform prototype designed for corporates and High-Net-Worth Individuals (HNIs), providing a seamless interface for managing Inter-Corporate Deposits (ICDs) and high-yield bond investments with role-based dashboards for Investors, Wealth Partners, and Administrators. The prototype features the official "Elevate Wealth Green" theme (#196b24ff and #e1f3e9ff) and fully mocked functionality for demonstration purposes including AI-powered investment assistance.

## Evolution Timeline
- 2025-07-30: Initial project setup and prototype development with Elevate Wealth Green theme
- 2025-07-30: Created landing page, login/register pages, and role-based dashboards
- 2025-07-30: Added About and Contact pages for completeness
- 2025-07-30: Implemented mock functionality for all forms and actions
- 2025-07-31: Updated color scheme to use official Elevate brand colors
- 2025-07-31: Enhanced dashboards with role-specific functionality
- 2025-07-31: Added AI Assistant feature for investor dashboard
- 2025-07-31: Implemented invitation management in admin dashboard
- 2025-07-31: Enhanced Investor Dashboard with ICD and Bond opportunities
- 2025-07-31: Improved Wealth Partner Dashboard with managed investors table
- 2025-07-31: Updated Admin Dashboard with tabbed interface for user, investment, and invitation management
- 2025-07-31: Fixed sidebar error by properly implementing SidebarProvider in DashboardLayout
- 2025-07-31: Enhanced the AIAssistant component with scripted conversation flows for investor dashboard
- 2025-07-31: Added AdminAIAssistant component for admin dashboard with report generation functionality
- 2025-07-31: Added simulation notices for all investment-related forms and pages

## Clarifications Needed
- Are there specific regulatory compliance features that need to be highlighted?
- What additional investment products might be added in future iterations?
- Should KYC verification have a dedicated workflow or integration points?
- Are there specific reporting requirements for different user roles?

## Repo Map
### Pages
- `/app/repo/apps/website/src/pages/Home.tsx`: Main landing page showcasing Elevate platform features
- `/app/repo/apps/website/src/pages/Login.tsx`: Login page with email/password and OTP options
- `/app/repo/apps/website/src/pages/Register.tsx`: Registration page for new users with invite code
- `/app/repo/apps/website/src/pages/About.tsx`: About page with company information
- `/app/repo/apps/website/src/pages/Contact.tsx`: Contact page with form and company details
- `/app/repo/apps/website/src/pages/ErrorPage.tsx`: Custom 404 page with navigation options

### Investor Dashboard Pages
- `/app/repo/apps/website/src/pages/dashboard/investor/Dashboard.tsx`: Overview with portfolio summary and investment opportunities
- `/app/repo/apps/website/src/pages/dashboard/investor/ICDs.tsx`: Manage ICD investments and requests
- `/app/repo/apps/website/src/pages/dashboard/investor/Bonds.tsx`: View and manage bond holdings
- `/app/repo/apps/website/src/pages/dashboard/investor/Documents.tsx`: Access investment documents
- `/app/repo/apps/website/src/pages/dashboard/investor/History.tsx`: View transaction history

### Wealth Partner Dashboard Pages
- `/app/repo/apps/website/src/pages/dashboard/partner/Dashboard.tsx`: Partner overview with managed investors table
- `/app/repo/apps/website/src/pages/dashboard/partner/Investors.tsx`: Manage investor clients
- `/app/repo/apps/website/src/pages/dashboard/partner/Reports.tsx`: Performance and commission reports
- `/app/repo/apps/website/src/pages/dashboard/partner/Referrals.tsx`: Referral program management

### Admin Dashboard Pages
- `/app/repo/apps/website/src/pages/dashboard/admin/Dashboard.tsx`: Admin overview with user, investment, and invitation management
- `/app/repo/apps/website/src/pages/dashboard/admin/Users.tsx`: User management and permissions
- `/app/repo/apps/website/src/pages/dashboard/admin/ICDs.tsx`: Manage and approve ICD requests
- `/app/repo/apps/website/src/pages/dashboard/admin/Bonds.tsx`: Bond offering management

### Layout Components
- `/app/repo/apps/website/src/components/layout/RootLayout.tsx`: Main layout for public pages
- `/app/repo/apps/website/src/components/layout/Header.tsx`: Navigation header for public pages
- `/app/repo/apps/website/src/components/layout/Footer.tsx`: Footer with company information
- `/app/repo/apps/website/src/components/layout/DashboardLayout.tsx`: Dashboard layout with sidebar

### Page Section Components
- `/app/repo/apps/website/src/components/sections/HeroSection.tsx`: Landing page hero section
- `/app/repo/apps/website/src/components/sections/FeaturesSection.tsx`: Platform features showcase
- `/app/repo/apps/website/src/components/sections/LoginSection.tsx`: Quick login options on landing page

### Dashboard Components
- `/app/repo/apps/website/src/components/dashboard/StatCard.tsx`: Reusable statistics card
- `/app/repo/apps/website/src/components/dashboard/ICDRequestForm.tsx`: Form for new ICD requests with simulation notice
- `/app/repo/apps/website/src/components/dashboard/InvestorCard.tsx`: Form to add new investors
- `/app/repo/apps/website/src/components/dashboard/BondUploadForm.tsx`: Form to upload bond lists
- `/app/repo/apps/website/src/components/dashboard/ConfirmationDialog.tsx`: Reusable confirmation dialog
- `/app/repo/apps/website/src/components/dashboard/AIAssistant.tsx`: AI-powered investment assistant for investors with scripted conversation flows
- `/app/repo/apps/website/src/components/dashboard/AdminAIAssistant.tsx`: AI report generation assistant for admin dashboard
- `/app/repo/apps/website/src/components/dashboard/InvitationForm.tsx`: Form for admin to send user invitations

### Form Components
- `/app/repo/apps/website/src/components/forms/LoginForm.tsx`: Authentication form with multiple methods
- `/app/repo/apps/website/src/components/forms/RegisterForm.tsx`: User registration form with invite code

### Theme and Styling
- `/app/repo/apps/website/src/index.css`: Global styles and theme definitions
- `/app/repo/apps/website/src/components/ui/theme-switcher.tsx`: Theme switcher with Elevate Wealth Green theme