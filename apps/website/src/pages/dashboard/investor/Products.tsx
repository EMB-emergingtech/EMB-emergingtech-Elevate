import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, ArrowRight, ShieldCheck, BarChart2, Building } from 'lucide-react';

const ProductCard = ({ title, icon, summary, flow, documents, benefit }: {
  title: string;
  icon: React.ReactNode;
  summary: string;
  flow: string[];
  documents: string[];
  benefit: string;
}) => (
  <Card className="premium-card h-full flex flex-col">
    <CardHeader className="flex flex-row items-center gap-4">
      {icon}
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col justify-between">
      <div>
        <p className="text-muted-foreground mb-6">{summary}</p>
        
        <h4 className="font-semibold mb-3">Investor Flow</h4>
        <ol className="space-y-3 mb-6">
          {flow.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <h4 className="font-semibold mb-3">Key Touchpoints</h4>
        <ul className="space-y-3 mb-6">
          {documents.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Primary Benefit</h4>
            <p className="text-muted-foreground">{benefit}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Products = () => {
  const products = [
    {
      title: 'Inter-Corporate Deposits (ICDs)',
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      summary: 'Secure, short-term lending instruments for corporates to manage liquidity. Earn predictable, fixed returns over a defined period.',
      flow: [
        'Submit an ICD request with your desired amount, rate, and tenure.',
        'Our team reviews the request and matches it with a suitable corporate borrower.',
        'Receive a term sheet for review. Accept, reject, or propose a counter-offer.',
        'Once terms are agreed, e-sign the standardized legal agreement.',
        'Transfer funds through our secure channel and track your investment until maturity.',
      ],
      documents: [
        'Detailed Term Sheet',
        'Counter-Offer Proposals',
        'Legally Vetted E-Agreements',
        'Monthly Interest & Principal Statements',
      ],
      benefit: 'Achieve higher yields than traditional cash instruments with robust security and complete transparency.',
    },
    {
      title: 'Unlisted Bonds',
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      summary: 'Access high-yield corporate bonds that are not available on public markets. Diversify your portfolio with curated, credit-rated opportunities.',
      flow: [
        'Browse our marketplace of vetted, unlisted corporate bonds.',
        'Review detailed information memorandums and credit rating reports.',
        'Place a bid for the desired quantity of bonds.',
        'Upon allocation, complete the payment process.',
        'Bonds are credited to your account for easy tracking of performance and coupon payments.',
      ],
      documents: [
        'Information Memorandum (IM)',
        'Credit Rating Reports',
        'Trade Confirmation Slips',
        'Portfolio Holding Statements',
      ],
      benefit: 'Unlock exclusive, high-return investment opportunities with professional due diligence and simplified execution.',
    },
    {
      title: 'SME REITs',
      icon: <Building className="h-8 w-8 text-primary" />,
      summary: 'Invest in a portfolio of income-generating commercial properties leased to small and medium enterprises (SMEs). Earn rental income and potential capital appreciation.',
      flow: [
        'Explore available SME Real Estate Investment Trusts (REITs) on our platform.',
        'Analyze property portfolios, tenant diversification, and projected yields.',
        'Subscribe to a REIT offering by specifying your investment amount.',
        'Funds are pooled and deployed by the REIT manager.',
        'Receive regular dividend payouts and monitor your investment\'s performance through our dashboard.',
      ],
      documents: [
        'Offering Circular / Prospectus',
        'Property Valuation Reports',
        'Quarterly Dividend Statements',
        'Annual Performance Reports',
      ],
      benefit: 'Gain exposure to the real estate market with smaller ticket sizes, professional management, and enhanced liquidity.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Our Investment Products</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto mt-2">
          Explore our curated selection of alternative investment opportunities, designed to deliver superior returns, transparency, and portfolio diversification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {products.map((product) => (
          <ProductCard key={product.title} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
