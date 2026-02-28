import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout({ children, currentView, setCurrentView }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) { document.documentElement.classList.add('dark'); }
        else { document.documentElement.classList.remove('dark'); }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex xl:hidden">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex w-full max-w-xs flex-1"><Sidebar className="w-full" currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setSidebarOpen(false); }} /></div>
                </div>
            )}
            <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-64 xl:flex-col">
                <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            </div>
            <div className="xl:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <Header setSidebarOpen={setSidebarOpen} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
                <main className="flex-1">
                    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-[1400px] mx-auto overflow-hidden">{children}</div>
                </main>
            </div>
        </div>
    );
}
