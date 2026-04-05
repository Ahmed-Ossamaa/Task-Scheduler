import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { GrowthInterval, OrgGrowthChartProps } from '@/features/analytics/types';
import { Loader2 } from 'lucide-react';



export function OrgGrowthChart({ 
  data, 
  interval, 
  onIntervalChange,
  isLoading 
}: OrgGrowthChartProps) {
  return (
    <Card className="min-w-0 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Organization Growth</CardTitle>
          <CardDescription>
            New Organziations Created over time.
          </CardDescription>
        </div>
        
        <Select 
          value={interval} 
          onValueChange={(val) => onIntervalChange(val as GrowthInterval)}
        >
          <SelectTrigger className="w-35 h-8 text-xs">
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={GrowthInterval.ONE_MONTH}>Last Month</SelectItem>
            <SelectItem value={GrowthInterval.THREE_MONTHS}>Last 3 Months</SelectItem>
            <SelectItem value={GrowthInterval.SIX_MONTHS}>Last 6 Months</SelectItem>
            <SelectItem value={GrowthInterval.ONE_YEAR}>Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="pb-4 flex-1">
        {isLoading ? (
          <div className="flex h-75 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex h-75 w-full items-center justify-center">
            <p className="text-muted-foreground">Not enough data to display growth.</p>
          </div>
        ) : (
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300} minWidth={1}>
              <AreaChart
                data={data}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* Gradient Area */}
                  <linearGradient id="colorOrgs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                
                <XAxis
                  dataKey="month"
                  tickFormatter={(value: Date) =>
                    new Date(value).toLocaleString('en-US', { month: 'short' })
                  }
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-muted-foreground"
                  minTickGap={30}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  labelFormatter={(label: any) => {
                    if (!label) return '';
                    return new Date(label).toLocaleString('en-US', { month: 'long', year: 'numeric' });
                  }}
                />
                
                <Area
                  type="monotone"
                  dataKey="orgs"
                  name="New Organizations"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrgs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}