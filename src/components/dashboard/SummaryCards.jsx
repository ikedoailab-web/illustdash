import { TrendingUp, Clock, DollarSign, Palette } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

export function SummaryCards() {
    const { projects } = useProjects();
    const totalRevenue = projects.reduce((acc, curr) => acc + Number(curr.price), 0);
    const totalHours = projects.reduce((acc, curr) => acc + Number(curr.hours), 0);
    const avgHourlyRate = totalHours > 0 ? Math.round(totalRevenue / totalHours) : 0;
    const completedProjects = projects.filter(p => p.status === '納品済み').length;

    const stats = [
        { name: '総報酬額', value: `¥${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { name: '総作業時間', value: `${totalHours} h`, icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { name: '平均時給換算', value: `¥${avgHourlyRate.toLocaleString()}`, icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
        { name: '納品済み案件', value: `${completedProjects} 件`, icon: Palette, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
    ];

    return (
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
                <div key={item.name} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                    <dt>
                        <div className={`absolute rounded-xl p-3 ${item.bgColor}`}><item.icon className={`h-6 w-6 ${item.color}`} /></div>
                        <p className="ml-16 truncate text-sm font-medium text-foreground/70">{item.name}</p>
                    </dt>
                    <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                        <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    </dd>
                </div>
            ))}
        </dl>
    );
}
