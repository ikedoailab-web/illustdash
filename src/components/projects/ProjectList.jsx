import { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Trash2, Search, ArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ProjectList() {
    const { projects, updateProjectStatus, deleteProject } = useProjects();
    const [filter, setFilter] = useState('all');
    const [sortKey, setSortKey] = useState('deliveryDate');
    const [search, setSearch] = useState('');

    const statusOptions = ['制作中', 'チェック待ち', '納品済み'];
    const statusColors = {
        '制作中': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
        'チェック待ち': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
        '納品済み': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
    };

    const filteredProjects = projects
        .filter(p => filter === 'all' || p.status === filter)
        .filter(p => search === '' || p.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortKey === 'price') return Number(b.price) - Number(a.price);
            if (sortKey === 'deliveryDate') return (a.deliveryDate || '').localeCompare(b.deliveryDate || '');
            return 0;
        });

    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">案件一覧・進捗</h1>
                <p className="text-foreground/60 mt-1">すべてのイラスト案件をここで管理できます</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <input type="text" placeholder="案件名で検索..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
                <div className="flex gap-2">
                    {['all', ...statusOptions].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all", filter === s ? "bg-primary/10 text-primary border-primary/20" : "border-border text-foreground/60 hover:bg-muted")}>
                            {s === 'all' ? 'すべて' : s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/20">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">案件名</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">カテゴリ</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider cursor-pointer" onClick={() => setSortKey('price')}>
                                    <span className="flex items-center gap-1">単価 <ArrowUpDown className="h-3 w-3" /></span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider cursor-pointer" onClick={() => setSortKey('deliveryDate')}>
                                    <span className="flex items-center gap-1">納品日 <ArrowUpDown className="h-3 w-3" /></span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">ステータス</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-foreground/60 uppercase tracking-wider">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredProjects.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-foreground/40">案件が見つかりません</td></tr>
                            ) : filteredProjects.map(project => (
                                <tr key={project.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-foreground max-w-[200px] truncate">{project.title}</td>
                                    <td className="px-6 py-4 text-sm text-foreground/70">{project.category}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-foreground">¥{Number(project.price).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-foreground/70">{project.deliveryDate}</td>
                                    <td className="px-6 py-4">
                                        <select value={project.status} onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                                            className={cn("text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer appearance-none outline-none", statusColors[project.status])}>
                                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => { if (window.confirm('削除しますか？')) deleteProject(project.id); }}
                                            className="text-foreground/30 hover:text-red-500 transition-colors p-1">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
