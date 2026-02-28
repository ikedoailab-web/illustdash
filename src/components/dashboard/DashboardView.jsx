import { SummaryCards } from './SummaryCards';
import { RevenueChart } from './RevenueChart';
import { CategoryPieChart } from './CategoryPieChart';

export function DashboardView() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
                <p className="text-foreground/60 mt-1">イラスト案件の全体像をひと目で把握できます</p>
            </div>
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <CategoryPieChart />
            </div>
        </div>
    );
}
