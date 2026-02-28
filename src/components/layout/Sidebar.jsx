import { useState } from 'react';
import { LayoutDashboard, Palette, ListTodo, PlusSquare, Calendar, Share2, Download, Cloud, CloudOff, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProjects } from '../../context/ProjectContext';

export function Sidebar({ className, currentView, setCurrentView }) {
    const { exportToCSV, isCloudConnected } = useProjects();
    const [copied, setCopied] = useState(false);

    const navigation = [
        { name: 'ダッシュボード', id: 'dashboard', icon: LayoutDashboard },
        { name: '案件追加', id: 'add', icon: PlusSquare },
        { name: '案件一覧・進捗', id: 'list', icon: ListTodo },
        { name: 'カレンダー', id: 'calendar', icon: Calendar },
    ];

    const handleShareLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className={cn("flex h-full w-64 flex-col bg-card border-r border-border", className)}>
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mr-3 shadow-sm shadow-primary/20">
                    <Palette className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">IllustDash</span>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                <nav className="flex-1 space-y-2">
                    {navigation.map((item) => {
                        const isCurrent = currentView === item.id;
                        return (
                            <button
                                key={item.name}
                                onClick={() => setCurrentView && setCurrentView(item.id)}
                                className={cn(
                                    isCurrent
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground border border-transparent",
                                    "w-full group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                                )}
                            >
                                <item.icon className={cn(isCurrent ? "text-primary" : "text-foreground/50 group-hover:text-foreground", "mr-3 h-5 w-5 flex-shrink-0 transition-colors")} />
                                {item.name}
                            </button>
                        )
                    })}
                </nav>
                <div className="mt-4 pt-4 border-t border-border space-y-1">
                    <p className="px-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-2">ツール</p>
                    <button onClick={handleShareLink} className="w-full text-foreground/70 hover:bg-foreground/5 hover:text-foreground group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent">
                        {copied ? <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" /> : <Share2 className="text-foreground/50 group-hover:text-foreground mr-3 h-5 w-5 flex-shrink-0 transition-colors" />}
                        {copied ? 'コピーしました！' : '共有リンクをコピー'}
                    </button>
                    <button onClick={exportToCSV} className="w-full text-foreground/70 hover:bg-foreground/5 hover:text-foreground group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent">
                        <Download className="text-foreground/50 group-hover:text-foreground mr-3 h-5 w-5 flex-shrink-0 transition-colors" />
                        CSV出力
                    </button>
                </div>
            </div>
            <div className="p-4 border-t border-border">
                <div className={cn("flex items-center rounded-xl px-3 py-2.5 text-xs font-medium", isCloudConnected ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400")}>
                    {isCloudConnected ? <Cloud className="mr-2 h-4 w-4 flex-shrink-0" /> : <CloudOff className="mr-2 h-4 w-4 flex-shrink-0" />}
                    {isCloudConnected ? 'クラウド同期中' : 'ローカル保存モード'}
                </div>
            </div>
        </div>
    );
}
