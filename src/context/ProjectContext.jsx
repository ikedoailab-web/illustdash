import { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isCloudConnected = !!supabase;

    useEffect(() => {
        const loadData = async () => {
            if (supabase) {
                try {
                    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
                    if (error) throw error;
                    const formattedData = data.map(item => ({
                        id: item.id, title: item.title, category: item.category,
                        price: item.price, hours: item.hours,
                        deliveryDate: item.delivery_date, status: item.status,
                        month: item.delivery_date ? item.delivery_date.substring(0, 7) : format(new Date(), 'yyyy-MM')
                    }));
                    setProjects(formattedData);
                } catch (error) {
                    console.error('Error fetching from Supabase:', error);
                    const saved = localStorage.getItem('illustdash_projects');
                    if (saved) { try { setProjects(JSON.parse(saved)); } catch (e) { /* */ } }
                }
            } else {
                const saved = localStorage.getItem('illustdash_projects');
                if (saved) {
                    try { setProjects(JSON.parse(saved)); } catch (e) { setProjects([]); }
                } else {
                    setProjects([]);
                }
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!supabase && !isLoading) {
            localStorage.setItem('illustdash_projects', JSON.stringify(projects));
        }
    }, [projects, isLoading]);

    const addProject = async (project) => {
        const generatedId = Math.random().toString(36).substr(2, 9);
        const month = project.deliveryDate ? project.deliveryDate.substring(0, 7) : format(new Date(), 'yyyy-MM');
        let newProject = { ...project, id: generatedId, month };
        setProjects((prev) => [newProject, ...prev]);

        if (supabase) {
            try {
                const { data, error } = await supabase.from('projects').insert([{
                    title: project.title, category: project.category,
                    price: project.price, hours: project.hours,
                    delivery_date: project.deliveryDate, status: project.status
                }]).select('*').single();
                if (error) throw error;
                setProjects((prev) => prev.map(p => p.id === generatedId ? { ...p, id: data.id, month: data.delivery_date.substring(0, 7) } : p));
            } catch (error) {
                console.error('Error inserting:', error);
                setProjects((prev) => prev.filter(p => p.id !== generatedId));
                alert('通信エラーが発生しました。');
            }
        }
    };

    const editProject = async (id, updatedData) => {
        const month = updatedData.deliveryDate ? updatedData.deliveryDate.substring(0, 7) : format(new Date(), 'yyyy-MM');
        const updatedProject = { ...updatedData, id, month };
        const previousProjects = [...projects];
        setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));

        if (supabase) {
            try {
                const { error } = await supabase.from('projects').update({
                    title: updatedData.title, category: updatedData.category,
                    price: updatedData.price, hours: updatedData.hours,
                    delivery_date: updatedData.deliveryDate, status: updatedData.status
                }).eq('id', id);
                if (error) throw error;
            } catch (error) {
                console.error('Error updating:', error);
                setProjects(previousProjects);
                alert('通信エラーが発生しました。');
            }
        }
    };

    const updateProjectStatus = async (id, newStatus) => {
        const previousProjects = [...projects];
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
        if (supabase) {
            try {
                const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', id);
                if (error) throw error;
            } catch (error) {
                setProjects(previousProjects);
            }
        }
    };

    const deleteProject = async (id) => {
        const previousProjects = [...projects];
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (supabase) {
            try {
                const { error } = await supabase.from('projects').delete().eq('id', id);
                if (error) throw error;
            } catch (error) {
                setProjects(previousProjects);
            }
        }
    };

    const exportToCSV = () => {
        if (projects.length === 0) { alert('エクスポートする案件データがありません。'); return; }
        const headers = ['案件名', 'カテゴリ', '単価(円)', '作業時間(h)', '納品日', 'ステータス'];
        const rows = projects.map(p => [p.title, p.category, p.price, p.hours, p.deliveryDate, p.status]);
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `illustdash_projects_${format(new Date(), 'yyyyMMdd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <ProjectContext.Provider value={{ projects, addProject, editProject, updateProjectStatus, deleteProject, exportToCSV, isLoading, isCloudConnected }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjects = () => useContext(ProjectContext);
