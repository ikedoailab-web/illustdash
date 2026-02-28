import { useMemo } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#ec4899', '#a855f7', '#f59e0b', '#10b981', '#6366f1'];

export function CategoryPieChart() {
    const { projects } = useProjects();
    const chartData = useMemo(() => {
        const categoryData = {};
        projects.forEach(p => {
            if (!categoryData[p.category]) categoryData[p.category] = 0;
            categoryData[p.category] += Number(p.price);
        });
        return Object.entries(categoryData).map(([name, value]) => ({ name, value }));
    }, [projects]);

    if (chartData.length === 0) return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">カテゴリ別売上</h3>
            <div className="h-[300px] flex items-center justify-center text-foreground/40">案件を追加するとカテゴリ別グラフが表示されます</div>
        </div>
    );

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">カテゴリ別売上</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                        {chartData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(v) => `¥${Number(v).toLocaleString()}`} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
