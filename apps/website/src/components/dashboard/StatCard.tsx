import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, change, className }: StatCardProps) => {
  return (
    <Card className={cn("premium-card", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground/70">{icon}</div>}
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <h3 className="text-2xl font-semibold numeric">{value}</h3>
          {change && (
            <span className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              change.positive 
                ? "bg-[hsl(130,80%,94%)] text-[hsl(130,60%,30%)]" 
                : "bg-[hsl(0,80%,94%)] text-[hsl(0,60%,40%)]"
            )}>
              {change.positive ? '+' : ''}{change.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;