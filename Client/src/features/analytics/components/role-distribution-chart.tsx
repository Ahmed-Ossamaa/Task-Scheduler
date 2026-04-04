import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Sector,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieSectorShapeProps,
} from 'recharts';
import { RoleDistributionChartProps } from '../types';

const renderCustomSector = (props: PieSectorShapeProps) => {
  return <Sector {...props} fill={props.payload.fill} />;
};

export function RoleDistributionChart({ data }: RoleDistributionChartProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Role Distribution</CardTitle>
        <CardDescription>Breakdown of user privileges across the system.</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        {data.length === 0 ? (
          <div className="flex h-75 w-full items-center justify-center">
            <p className="text-muted-foreground">No role data available.</p>
          </div>
        ) : (
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300} minWidth={65}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  shape={renderCustomSector} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}