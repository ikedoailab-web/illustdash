import { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { format, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProjectForm } from '../projects/ProjectForm';

export function CalendarView() {
    const { projects } = useProjects();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateForNew, setSelectedDateForNew] = useState(null);
    const [selectedProjectForEdit, setSelectedProjectForEdit] = useState(null);

    const monthStart = startOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startOfWeek(monthStart, { weekStartsOn: 0 }), end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 0 }) });
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

    const statusColors = {
        '制作中': 'bg-blue-500/10 text-blue-500 border-blue-500/30 hover:bg-blue-500/20',
        'チェック待ち': 'bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-orange-500/20',
        '納品済み': 'bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20',
    };
    const statusDotColors = { '制作中': 'bg-blue-500', 'チェック待ち': 'bg-orange-500', '納品済み': 'bg-green-500' };

    const handleDayClick = (day) => { setSelectedProjectForEdit(null); setSelectedDateForNew(format(day, 'yyyy-MM-dd')); setIsModalOpen(true); };
    const handleProjectClick = (e, project) => { e.stopPropagation(); setSelectedDateForNew(null); setSelectedProjectForEdit(project); setIsModalOpen(true); };
    const handleClose = () => { setIsModalOpen(false); setSelectedProjectForEdit(null); };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">カレンダー</h1>
                    <p className="text-foreground/60 mt-1">納品日ベースでスケジュールを管理。日付クリックで追加、案件クリックで編集</p>
                </div>
                <div className="flex items-center space-x-4 bg-card border border-border rounded-xl p-1 shadow-sm">
                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors">今日</button>
                    <div className="h-6 w-px bg-border"></div>
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-muted/50 rounded-lg transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                    <h2 className="text-lg font-bold min-w-[120px] text-center">{format(currentDate, "yyyy年 MMMM", { locale: ja })}</h2>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-muted/50 rounded-lg transition-colors"><ChevronRight className="h-5 w-5" /></button>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 border-b border-border bg-muted/20">
                    {weekDays.map((day, i) => (<div key={day} className={cn("py-3 text-center text-sm font-semibold", i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-foreground/70")}>{day}</div>))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[minmax(120px,_auto)]">
                    {days.map((day, dayIdx) => {
                        const dayProjects = projects.filter(p => p.deliveryDate === format(day, 'yyyy-MM-dd'));
                        return (
                            <div key={day.toString()} onClick={() => handleDayClick(day)}
                                className={cn("min-h-[120px] p-2 border-r border-b border-border transition-all cursor-pointer hover:bg-muted/20 group relative",
                                    !isSameMonth(day, monthStart) && "bg-muted/5 opacity-50", (dayIdx + 1) % 7 === 0 && "border-r-0", dayIdx >= days.length - 7 && "border-b-0", isToday(day) && "bg-primary/5")}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className={cn("w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-all", isToday(day) ? "bg-primary text-primary-foreground font-bold shadow-md scale-110" : "group-hover:text-primary")}>{format(day, 'd')}</span>
                                    {dayProjects.length > 0 && <span className="text-xs font-semibold text-foreground/40 bg-muted px-2 py-0.5 rounded-full">{dayProjects.length}件</span>}
                                </div>
                                <div className="space-y-1.5 mt-2 relative z-10 p-0.5">
                                    {dayProjects.map(project => (
                                        <div key={project.id} onClick={(e) => handleProjectClick(e, project)}
                                            className={cn("px-2 py-1.5 text-xs rounded-md border truncate font-medium flex items-center justify-between cursor-pointer transition-all shadow-sm", statusColors[project.status] || 'bg-card border-border')}
                                            title={`${project.title} - クリックで編集`}>
                                            <span className="truncate pr-1">{project.title}</span>
                                            <div className={cn("w-2 h-2 rounded-full shadow-sm shrink-0", statusDotColors[project.status])} />
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-primary transition-opacity pointer-events-none"><span className="text-2xl font-light leading-none">+</span></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70 px-2 pb-4">
                <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-primary" /><span className="font-semibold">凡例:</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" /><span>制作中</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" /><span>チェック待ち</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" /><span>納品済み</span></div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose}></div>
                    <div className="relative bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <ProjectForm isModal={true} initialDeliveryDate={selectedDateForNew} initialData={selectedProjectForEdit} onCancel={handleClose} onSuccess={handleClose} />
                    </div>
                </div>
            )}
        </div>
    );
}
