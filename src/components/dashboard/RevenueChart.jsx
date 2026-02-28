import { useMemo } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function RevenueChart() {
    const { projects } = useProjects();
    const chartData = useMemo(() => {
        const monthlyData = {};
        projects.forEach(p => {
            const month = p.month || p.deliveryDate?.substring(0, 7);
            if (!month) return;
            if (!monthlyData[month]) monthlyData[month] = { month, revenue: 0, count: 0 };
            monthlyData[month].revenue += Number(p.price);
            monthlyData[month].count += 1;
        });
        return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6).map(d => ({
            ...d, label: d.month.replace(/^\d{4}-/, '').replace(/^0/, '') + '月',
            avgPrice: d.count > 0 ? Math.round(d.revenue / d.count) : 0,
        }));
    }, [projects]);

    if (chartData.length === 0) return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">月次売上推移</h3>
            <div className="h-[300px] flex items-center justify-center text-foreground/40">案件を追加すると売上グラフが表示されます</div>
        </div>
    );

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">月次売上推移</h3>
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => `¥${Number(v).toLocaleString()}`} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="hsl(330, 70%, 55%)" radius={[6, 6, 0, 0]} name="月間売上" fillOpacity={0.8} />
                    <Line yAxisId="right" type="monotone" dataKey="avgPrice" stroke="hsl(280, 60%, 55%)" strokeWidth={2} name="平均単価" dot={{ r: 4 }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
