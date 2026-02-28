import { Menu, Moon, Sun } from 'lucide-react';

export function Header({ setSidebarOpen, darkMode, toggleDarkMode }) {
    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card/80 px-4 backdrop-blur-lg sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-foreground/70 xl:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 gap-x-4 self-stretch justify-end lg:gap-x-6">
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-foreground/5 transition-colors">
                        {darkMode ? <Sun className="h-5 w-5 text-foreground/70" /> : <Moon className="h-5 w-5 text-foreground/70" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
