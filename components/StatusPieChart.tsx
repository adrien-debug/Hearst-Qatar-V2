import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface StatusPieChartProps {
  data: StatusData[];
  size?: number;
}

const COLORS = {
  'OK': '#8AFD81',
  'In Service': '#8AFD81',
  'Warning': '#FBBF24',
  'Maintenance': '#F59E0B',
  'Standby': '#9CA3AF',
  'Off': '#EF4444',
};

export default function StatusPieChart({ data, size = 200 }: StatusPieChartProps) {
  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0);
    return percent !== '0' ? `${percent}%` : '';
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={size / 2 - 10}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0b1120',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => [`${value}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs text-[#64748b] font-medium">{entry.name}</span>
            <span className="text-xs text-[#64748b]">({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Fonction utilitaire pour préparer les données de statut
export function prepareStatusData(items: Array<{ status: string }>): StatusData[] {
  const statusCounts: { [key: string]: number } = {};
  
  items.forEach(item => {
    const status = item.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: COLORS[status as keyof typeof COLORS] || '#9CA3AF',
  })).filter(item => item.value > 0);
}

