import { useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectForm } from './components/projects/ProjectForm';
import { CalendarView } from './components/calendar/CalendarView';

function App() {
    const [currentView, setCurrentView] = useState('dashboard');

    return (
        <DashboardLayout currentView={currentView} setCurrentView={setCurrentView}>
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'calendar' && <CalendarView />}
            {currentView === 'list' && <ProjectList />}
            {currentView === 'add' && <ProjectForm onSuccess={() => setCurrentView('list')} />}
        </DashboardLayout>
    );
}

export default App;
